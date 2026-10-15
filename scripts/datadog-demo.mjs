import { cp, mkdir, readFile, writeFile, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const work = join(root, ".csp/datadog-demo");
const command = process.argv[2] ?? "build";
if (
  !["setup", "dev", "build", "check"].includes(command) ||
  process.argv.length > 3
)
  throw new Error("Usage: node scripts/datadog-demo.mjs setup|dev|build|check");
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
async function run(bin, argv, cwd, env = process.env) {
  await new Promise((done, fail) => {
    const child = spawn(bin, argv, {
      cwd,
      env,
      stdio: "inherit",
      shell: false,
    });
    const onInt = () => child.kill("SIGINT"),
      onTerm = () => child.kill("SIGTERM");
    process.once("SIGINT", onInt);
    process.once("SIGTERM", onTerm);
    const cleanup = () => {
      process.removeListener("SIGINT", onInt);
      process.removeListener("SIGTERM", onTerm);
    };
    child.once("error", (error) => {
      cleanup();
      fail(error);
    });
    child.once("exit", (code, signal) => {
      cleanup();
      if (code === 0 || signal === "SIGINT" || signal === "SIGTERM") done();
      else fail(new Error(`${bin} exited ${code}`));
    });
  });
}
async function syncAssets() {
  for (const file of [
    "portal.datadog-demo.json",
    "content.json",
    "avatars.json",
    "public",
    "design-system",
  ])
    await cp(join(root, file), join(work, file), { recursive: true });
}
const manifest = await readJson(join(root, "package.json"));
const profile = await readJson(join(root, "portal.datadog-demo.json"));
const names = [
  ...new Set(["@kieksme/csp-core", "@kieksme/csp-sdk", ...profile.plugins]),
];
const dependencies = Object.fromEntries(
  names.map((name) => [name, manifest.dependencies[name]]),
);
const devDependencies = {
  "@kieksme/csp-cli": manifest.devDependencies["@kieksme/csp-cli"],
};
if (
  Object.values({ ...dependencies, ...devDependencies }).some(
    (v) => !/^\d+\.\d+\.\d+$/.test(v ?? ""),
  )
)
  throw new Error("Datadog demo requires exact published CSP versions");
await mkdir(work, { recursive: true });
async function setup() {
  await writeFile(
    join(work, "package.json"),
    JSON.stringify(
      {
        name: "acme-datadog-demo",
        private: true,
        type: "module",
        dependencies,
        devDependencies,
        csp: { stylesheet: "design-system/portal.css" },
        packageManager: manifest.packageManager,
      },
      null,
      2,
    ) + "\n",
  );
  await writeFile(
    join(work, "pnpm-workspace.yaml"),
    JSON.stringify(
      {
        allowBuilds: { esbuild: true, sharp: false },
        minimumReleaseAgeExclude: Object.entries({
          ...dependencies,
          ...devDependencies,
        }).map(([name, version]) => `${name}@${version}`),
      },
      null,
      2,
    ) + "\n",
  );
  await run("pnpm", ["install", "--no-frozen-lockfile"], work);
}
let needsSetup = command === "setup";
if (!needsSetup) {
  try {
    const existing = await readJson(join(work, "package.json"));
    await access(join(work, "node_modules/@kieksme/csp-cli/dist/index.js"));
    needsSetup =
      JSON.stringify(existing.dependencies) !== JSON.stringify(dependencies) ||
      JSON.stringify(existing.devDependencies) !==
        JSON.stringify(devDependencies);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    needsSetup = true;
  }
}
if (needsSetup) await setup();
await syncAssets();
if (command !== "setup") {
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
