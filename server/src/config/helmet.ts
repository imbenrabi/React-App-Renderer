import helmet, { FastifyHelmetOptions } from "@fastify/helmet";
import type { ServerConfig } from "./environment";

export function getHelmetConfig(config: ServerConfig): FastifyHelmetOptions {
  if (config.isDev) {
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

  return {
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'"],
        "style-src": ["'self'"],
        "img-src": ["'self'", "data:"],
      },
    },
  };
}
