import { FastifyCorsOptions } from "@fastify/cors";
import { ServerConfig } from "./environment";

export function getCorsConfig(config: ServerConfig): FastifyCorsOptions {
  return {
    origin: config.isDev
      ? `http://localhost:${config.clientPort}`
      : config.corsOrigin,
    credentials: true,
  };
}
