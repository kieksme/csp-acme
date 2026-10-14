import { cp, mkdir, readFile, writeFile, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const work = join(root, ".csp/datadog-demo");
const sourceFile = join(root, ".csp/datadog-source.json");
const command = process.argv[2] ?? "build";
const args = process.argv.slice(3).filter((v) => v !== "--");
if (
  !["setup", "dev", "build", "check"].includes(command) ||
  (args.length && (args[0] !== "--source" || args.length !== 2))
) {
  throw new Error(
    "Usage: node scripts/datadog-demo.mjs setup|dev|build|check [--source <CSP checkout>]",
  );
}
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
async function run(bin, argv, cwd, env = process.env) {
  await new Promise((done, fail) => {
    const child = spawn(bin, argv, {
      cwd,
      env,
      stdio: "inherit",
      shell: false,
    });
    const stop = (signal) => child.kill(signal);
    const onInt = () => stop("SIGINT"),
      onTerm = () => stop("SIGTERM");
    process.once("SIGINT", onInt);
    process.once("SIGTERM", onTerm);
    child.once("error", fail);
    child.once("exit", (code, signal) => {
      process.removeListener("SIGINT", onInt);
      process.removeListener("SIGTERM", onTerm);
      if (code === 0 || signal === "SIGINT" || signal === "SIGTERM") done();
      else fail(new Error(`${bin} exited ${code}`));
    });
  });
}
async function sourcePath() {
  if (args[0] === "--source") return resolve(args[1]);
  if (process.env.CSP_DATADOG_SOURCE)
    return resolve(process.env.CSP_DATADOG_SOURCE);
  try {
    return (await readJson(sourceFile)).path;
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  return resolve(root, "../csp");
}
async function syncAssets() {
  for (const file of [
    "portal.datadog-demo.json",
    "content.json",
    "avatars.json",
    "public",
    "design-system",
  ]) {
    await cp(join(root, file), join(work, file), { recursive: true });
  }
}
async function setup() {
  const source = await sourcePath();
  await access(join(source, "packages/plugin-datadog/package.json")).catch(
    () => {
      throw new Error(
        "Datadog-Quellpaket fehlt. Einmal pnpm setup:datadog --source <CSP-Worktree> ausführen.",
      );
    },
  );
  console.log(
    "Datadog-Demo: lokale CSP-Pakete bauen und isoliert installieren.",
  );
  await run("pnpm", ["-r", "--filter", "./packages/**", "build"], source);
  const archives = join(work, "packages");
  await mkdir(archives, { recursive: true });
  const overrides = {};
  for (const folder of [
    "sdk",
    "core",
    "cli",
    "plugin-datadog",
    "plugin-contact",
    "plugin-content",
    "plugin-chat",
  ]) {
    const path = join(source, "packages", folder);
    const pkg = await readJson(join(path, "package.json"));
    await run("pnpm", ["pack", "--pack-destination", archives], path);
    const archive =
      pkg.name.replace("@", "").replace("/", "-") + "-" + pkg.version + ".tgz";
    const hash = createHash("sha256")
      .update(await readFile(join(archives, archive)))
      .digest("hex")
      .slice(0, 12);
    const pinnedArchive = archive.replace(".tgz", "-" + hash + ".tgz");
    await cp(join(archives, archive), join(archives, pinnedArchive));
    overrides[pkg.name] = "file:packages/" + pinnedArchive;
  }
  await syncAssets();
  const profile = await readJson(join(work, "portal.datadog-demo.json"));
  const dependencies = Object.fromEntries(
    [
      ...new Set(["@kieksme/csp-core", "@kieksme/csp-sdk", ...profile.plugins]),
    ].map((name) => [name, overrides[name]]),
  );
  await writeFile(
    join(work, "package.json"),
    JSON.stringify(
      {
        name: "acme-datadog-local-demo",
        private: true,
        type: "module",
        dependencies,
        devDependencies: { "@kieksme/csp-cli": overrides["@kieksme/csp-cli"] },
        csp: { stylesheet: "design-system/portal.css" },
        packageManager: "pnpm@12.8.1",
      },
      null,
      2,
    ) + "\n",
  );
  await writeFile(
    join(work, "pnpm-workspace.yaml"),
    JSON.stringify(
      { overrides, allowBuilds: { esbuild: true, sharp: false } },
      null,
      2,
    ) + "\n",
  );
  await run("pnpm", ["install", "--no-frozen-lockfile"], work);
  await writeFile(sourceFile, JSON.stringify({ path: source }, null, 2) + "\n");
}
await mkdir(work, { recursive: true });
if (command === "setup") await setup();
else {
  try {
    await access(join(work, "node_modules/@kieksme/csp-cli/dist/index.js"));
  } catch {
    await setup();
  }
  await syncAssets();
  const cli = join(work, "node_modules/@kieksme/csp-cli/dist/index.js");
  const env = {
    ...process.env,
    CSP_DEMO: "true",
    CSP_CHAT_DEMO: "true",
    CSP_PORT: "3038",
    CSP_ALLOWED_ORIGINS: "http://127.0.0.1:5173,http://localhost:5173",
  };
  if (command === "check")
    await run(
      process.execPath,
      [cli, "validate", "--config", "portal.datadog-demo.json", "--production"],
      work,
      env,
    );
  await run(
    process.execPath,
    [
      cli,
      command === "dev" ? "dev" : "build",
      "--config",
      "portal.datadog-demo.json",
      ...(command === "dev" ? [] : ["--production"]),
    ],
    work,
    env,
  );
}
