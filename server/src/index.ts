import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import path from "path";
import fs from "fs";

async function getViteAssets() {
  try {
    const manifestPath = path.join(__dirname, "../client/dist/manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    // Find the main entry points
    //@ts-ignore
    const mainJs = Object.entries(manifest).find(([key]) =>
      key.endsWith("main.tsx")
    )?.[1].file;
    //@ts-ignore
    const mainCss = Object.entries(manifest).find(([key]) =>
      key.endsWith(".css")
    )?.[1].file;

    return {
      "main.js": mainJs ? `/${mainJs}` : null,
      "main.css": mainCss ? `/${mainCss}` : null,
    };
  } catch (error) {
    console.warn("No manifest file found, using default asset paths");
    return {
      "main.js": null,
      "main.css": null,
    };
  }
}

async function startServer() {
  const server = Fastify({ logger: true });
  const PORT = process.env.PORT || 4001;
  const isDev = process.env.NODE_ENV === "development";

  await server.register(sensible);
  await server.register(cors);

  // Configure helmet with CSP for development
  await server.register(helmet, {
    contentSecurityPolicy: isDev
      ? {
          directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": [
              "'self'",
              "'unsafe-inline'",
              "http://localhost:4000",
            ],
            "style-src": ["'self'", "'unsafe-inline'", "http://localhost:4000"],
            "connect-src": [
              "'self'",
              "http://localhost:4000",
              "ws://localhost:4000",
            ],
          },
        }
      : undefined,
  });

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

  server.get("/app-config.js", async (request, reply) => {
    const additionalData = {
      apiUrl: process.env.API_URL || "https://api.example.com",
      environment: process.env.NODE_ENV || "development",
    };
    reply.type("application/javascript").send(`
      window.__APP_CONFIG__ = ${JSON.stringify(additionalData)};
    `);
  });

  server.get("/", async (request, reply) => {
    const assets = await getViteAssets();
    return reply.view("index.ejs", {
      title: "Your App",
      assets,
      isDev,
    });
  });

  try {
    await server.listen({ port: +PORT, host: "0.0.0.0" });
    console.log(`Server is running at http://localhost:${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

startServer();
