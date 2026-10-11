import { readFile, writeFile, access } from "node:fs/promises";
import { parseArgs } from "node:util";
const { values } = parseArgs({
  options: {
    "tenant-id": { type: "string" },
    "portal-client-id": { type: "string" },
    "api-audience": { type: "string" },
    "scope-name": { type: "string", default: "Chat.Access" },
    force: { type: "boolean", default: false },
  },
});
const guid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
for (const key of ["tenant-id", "portal-client-id", "api-audience"]) {
  if (
    !guid.test(values[key] ?? "") ||
    values[key] === "00000000-0000-0000-0000-000000000000"
  )
    throw new Error(
      `Provide a real Entra GUID with --${key}. No credentials are written by this script.`,
    );
}
if (!/^[a-z0-9_.-]+$/i.test(values["scope-name"]))
  throw new Error("Invalid API scope name");
const output = new URL("../portal.support.json", import.meta.url);
let exists = true;
try {
  await access(output);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  exists = false;
}
if (exists && !values.force)
  throw new Error(
    "portal.support.json already exists; use --force to regenerate it",
  );
const profile = JSON.parse(
  await readFile(new URL("../portal.hosted.json", import.meta.url), "utf8"),
);
profile.chatSupport = {
  mode: "slack",
  auth: "msal",
  tenantId: values["tenant-id"],
  clientId: values["portal-client-id"],
  scope: `api://${values["api-audience"]}/${values["scope-name"]}`,
};
await writeFile(output, JSON.stringify(profile, null, 2) + "\n");
console.log(
  "Created portal.support.json with public Entra settings. Configure .env.slack.example at the API host, then build:support.",
);
