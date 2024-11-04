import helmet, { FastifyHelmetOptions } from "@fastify/helmet";
import type { ServerConfig } from "./environment";

export function getHelmetConfig(config: ServerConfig): FastifyHelmetOptions {
  if (!config.isDev) {
    return {}; // Use default strict settings in production
  }

  const clientOrigin = `http://localhost:${config.clientPort}`;

  return {
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", clientOrigin],
        "style-src": ["'self'", "'unsafe-inline'", clientOrigin],
        "connect-src": [
          "'self'",
          clientOrigin,
          clientOrigin.replace("http", "ws"),
        ],
        "img-src": ["'self'", "data:", clientOrigin],
      },
    },
  };
}
