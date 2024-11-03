import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import path from "path";

async function startServer() {
  const server = Fastify({ logger: true });
  const PORT = process.env.PORT || 4001;

  await server.register(sensible); // adds sensible defaults

  await server.register(cors); // adds CORS headers

  await server.register(helmet); // adds security headers

  // Register the EJS view engine
  server.register(fastifyView, {
    engine: {
      ejs: require("ejs"),
    },
    root: path.join(__dirname, "views"),
  });

  // Serve static files from the client build directory
  server.register(fastifyStatic, {
    root: path.join(__dirname, "../client/dist"),
    prefix: "/", // all files are served at the root level
  });

  // Route to render the EJS file
  server.get("/", async (request, reply) => {
    return reply.view("/index.ejs", { title: "Your App" });
  });

  // Start the server
  server.listen({ port: +PORT }, (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    }
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
