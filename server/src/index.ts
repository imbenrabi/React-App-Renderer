import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import { getServerConfig } from "./config/environment";
import { initRenderingService } from "./rendering-service";
import { getHelmetConfig } from "./config/helmet";
import { getCorsConfig } from "./config/cors";

(async function startServer() {
  const server = Fastify({ logger: true });
  const config = getServerConfig();

  await server.register(sensible);
  await server.register(cors, getCorsConfig(config));
  await server.register(helmet, getHelmetConfig(config));

  await initRenderingService(server, config);

  try {
    await server.listen({ port: config.port, host: config.host });
    if (config.isDev) {
      console.log(`Server is running at http://localhost:${config.port}`);
    } else {
      console.log(`Server is running at port: ${config.port}`);
    }
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
