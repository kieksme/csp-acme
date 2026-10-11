import { readFile, writeFile, access } from "node:fs/promises";
import { parseArgs } from "node:util";
const { values } = parseArgs({
  options: { force: { type: "boolean", default: false } },
});
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
profile.chatSupport = { mode: "slack", auth: "anonymous" };
await writeFile(output, JSON.stringify(profile, null, 2) + "\n");
console.log(
  "Created the public Slack support profile without login. Configure API runtime secrets, then build:support.",
);
