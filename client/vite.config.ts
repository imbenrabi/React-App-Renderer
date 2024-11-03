import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/" : "http://localhost:4000/",
  build: {
    outDir: path.resolve(__dirname, "dist"),
    assetsDir: "assets",
    manifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/main.tsx"),
      },
    },
  },
  server: {
    port: 4000,
    strictPort: true,
    origin: "http://localhost:4000",
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 4000,
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
}));
