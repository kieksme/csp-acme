import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const script = fileURLToPath(
  new URL("../build-api-image.mjs", import.meta.url),
);
const digest =
  "sha256:c3de60bf2f9dd0ac6370e6117950ff62d6e339527e7472301c9c78a017978392";
for (const mode of ["primary", "mirror", "unavailable"]) {
  test(`API image registry selection: ${mode}`, async () => {
    const root = await mkdtemp(join(tmpdir(), "acme-image-"));
    try {
      await mkdir(join(root, "node_modules/@kieksme/csp-cli/runtime"), {
        recursive: true,
      });
      await mkdir(join(root, "bin"));
      await writeFile(
        join(root, "node_modules/@kieksme/csp-cli/runtime/Dockerfile"),
        `FROM public.ecr.aws/docker/library/node:22-bookworm-slim@${digest} AS dependencies\nRUN true\nFROM public.ecr.aws/docker/library/node:22-bookworm-slim@${digest}\nUSER node\n`,
      );
      await writeFile(
        join(root, "bin/docker"),
        `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
fs.appendFileSync('calls.jsonl', JSON.stringify(args)+'\\n');
if (args[0] === 'pull' && (process.env.IMAGE_TEST_MODE === 'unavailable' || (process.env.IMAGE_TEST_MODE === 'mirror' && args[1].startsWith('public.ecr.aws/')))) process.exit(1);
`,
        { mode: 0o755 },
      );
      const result = spawnSync(
        process.execPath,
        [script, "portal.support.json", "customer-api", "api-image.tar"],
        {
          cwd: root,
          env: {
            ...process.env,
            PATH: join(root, "bin") + ":" + process.env.PATH,
            IMAGE_TEST_MODE: mode,
          },
          encoding: "utf8",
        },
      );
      const calls = (await readFile(join(root, "calls.jsonl"), "utf8"))
        .trim()
        .split("\n")
        .map(JSON.parse);
      if (mode === "unavailable") {
        assert.notEqual(result.status, 0);
        assert.equal(
          calls.some((args) => args[0] === "build"),
          false,
        );
      } else {
        assert.equal(result.status, 0, result.stderr);
        const generated = await readFile(join(root, ".csp/Dockerfile"), "utf8");
        const registry =
          mode === "primary"
            ? "public.ecr.aws/docker/library/"
            : "docker.io/library/";
        assert.equal(
          generated.split(`FROM ${registry}node:22-bookworm-slim@${digest}`)
            .length - 1,
          2,
        );
        assert.match(generated, /USER node/);
        assert.deepEqual(calls.at(-1), [
          "save",
          "customer-api",
          "-o",
          "api-image.tar",
        ]);
      }
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
}
