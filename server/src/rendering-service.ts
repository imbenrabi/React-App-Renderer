import { FastifyInstance } from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import path from "path";
import { getViteAssets } from "./utils/vite";
import { APP_CONFIG_KEY, APP_TITLE } from "./constants";
import type { ServerConfig } from "./config/environment";

interface AppConfig {
  apiUrl: string;
  environment: string;
}

export const initRenderingService = async (
  server: FastifyInstance,
  config: ServerConfig
) => {
  // Register the EJS view engine
  await server.register(fastifyView, {
    engine: {
      ejs: require("ejs"),
    },
    root: path.join(__dirname, "views"),
  });

  // Serve static files from the client build directory
  await server.register(fastifyStatic, {
    root: path.join(__dirname, "../client/dist"),
    prefix: "/",
  });

  // Inject app config
  server.get<{
    Reply: string;
  }>("/app-config.js", async (_, reply) => {
    const config: AppConfig = getMockAppConfig();

    return reply
      .type("application/javascript")
      .send(`window.${APP_CONFIG_KEY} = ${JSON.stringify(config)};`);
  });

  // Render index page
  server.get("/", async (_, reply) => {
    const viewParams = await getViewParams(config);

    return reply.view("index.ejs", viewParams);
  });
};

function getMockAppConfig(): AppConfig {
  return {
    apiUrl: "https://api.example.com",
    environment: "development",
  };
}

async function getViewParams(config: ServerConfig) {
  return {
    assets: await getViteAssets(),
    title: APP_TITLE,
    isDev: config.isDev,
  };
}
