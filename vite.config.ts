import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { publicConfig, portalBuild } from "@kieksme/csp-core/build";
import { customerEnv } from "./customer.config";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    portalBuild(
      publicConfig(
        customerEnv({
          ...loadEnv(mode, process.cwd(), ""),
          ...process.env,
        }),
      ),
    ),
  ],
  server: { port: 5173, strictPort: true },
}));
