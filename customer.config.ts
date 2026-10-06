import { readFileSync } from "node:fs";
import { parse } from "dotenv";

// Gemeinsame öffentliche Defaults für Frontend-Build und API-Runtime.
export function customerEnv(
  overrides: Record<string, string | undefined>,
): Record<string, string | undefined> {
  const env = {
    ...parse(readFileSync(".env.branding")),
    ...overrides,
  };
  return {
    ...env,
    CSP_LOGO_URL:
      env.CSP_LOGO_URL || `${env.CSP_BASE_PATH || "/"}acme-logo.svg`,
  };
}
