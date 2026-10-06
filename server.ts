import { config } from "dotenv";
import { createServer } from "@kieksme/csp-core/server";
import { publicConfig } from "@kieksme/csp-core/build";
import plugins from "./portal.server.js";
import { customerEnv } from "./customer.config.js";
config({ path: [".env.local", ".env"], quiet: true });
const env = customerEnv(process.env);
const app = await createServer({ plugins, config: publicConfig(env), env });
await app.listen({
  port: Number(env.CSP_PORT ?? 3001),
  host: env.CSP_HOST ?? "0.0.0.0",
});
for (const signal of ["SIGTERM", "SIGINT"])
  process.once(signal, () => {
    void app.close().then(() => process.exit(0));
  });
