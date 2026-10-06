import { mountPortal } from "@kieksme/csp-core/browser";
import "@kieksme/csp-core/style.css";
import type { PublicConfig } from "@kieksme/csp-sdk";
import plugins from "./portal.browser";
declare const __CSP_CONFIG__: PublicConfig;
if (import.meta.env.VITE_CSP_STATIC_DEMO === "true") {
  const { installPagesDemo } = await import("./pages-demo");
  installPagesDemo(__CSP_CONFIG__);
}
mountPortal(__CSP_CONFIG__, plugins);
