// vite.config.ts
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server/index"; // ✅ Make sure path is correct

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    configureServer(viteServer) {
      const app = createServer(); // ✅ Express app

      // Ensure Express handles routes *before* Vite’s HTML fallback
      viteServer.middlewares.use((req, res, next) => {
        if (req.url.startsWith("/api")) {
          return app(req, res, next);
        }
        next();
      });
    },
  };
}
