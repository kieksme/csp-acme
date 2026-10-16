import { mkdir, readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const [profile, image, archive] = process.argv.slice(2);
if (!profile || !image || !archive)
  throw new Error(
    "Usage: node scripts/build-api-image.mjs <profile> <image> <archive>",
  );
const reference =
  "node:22-bookworm-slim@sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392";
const primary = "public.ecr.aws/docker/library/" + reference;
const mirror = "docker.io/library/" + reference;
let dockerfile = await readFile(
  "node_modules/@kieksme/csp-cli/runtime/Dockerfile",
  "utf8",
);
const bases = [...dockerfile.matchAll(/^FROM (\S+)/gm)].map(
  (match) => match[1],
);
if (bases.length !== 2 || bases.some((base) => base !== primary))
  throw new Error("Review the CLI base image before changing its registry");
const docker = (args) => {
  const result = spawnSync("docker", args, { stdio: "inherit" });
  if (result.error) throw result.error;
  return result.status === 0;
};
if (!docker(["pull", primary])) {
  if (!docker(["pull", mirror]))
    throw new Error("Neither registry supplied the pinned Node image");
  dockerfile = dockerfile.replaceAll(primary, mirror);
}
await mkdir(".csp", { recursive: true });
await writeFile(".csp/Dockerfile", dockerfile);
await writeFile(
  ".csp/Dockerfile.dockerignore",
  "node_modules\n.git\n.env\n.env.*\ndist\n.csp\n",
);
if (
  !docker([
    "build",
    "-f",
    ".csp/Dockerfile",
    "--build-arg",
    `PORTAL_CONFIG=${profile}`,
    "-t",
    image,
    ".",
  ])
)
  throw new Error("API image build failed");
if (!docker(["save", image, "-o", archive]))
  throw new Error("API image export failed");
