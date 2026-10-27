import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

// Compatibility layer for customer portals pinned to CSP versions without this default.
export async function applySearchPolicy(directory = "dist") {
  const root = resolve(directory);
  async function visit(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const file = join(folder, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (entry.name.endsWith(".html")) {
        const html = (await readFile(file, "utf8")).replace(
          /<meta\b[^>]*\bname\s*=\s*["']robots["'][^>]*>/gi,
          "",
        );
        if (!/<head\b[^>]*>/i.test(html))
          throw new Error(`Missing head: ${file}`);
        await writeFile(
          file,
          html.replace(
            /<head\b[^>]*>/i,
            '$&\n<meta name="robots" content="noindex, nofollow">',
          ),
        );
      }
    }
  }
  await visit(root);
  await writeFile(join(root, "robots.txt"), "User-agent: *\nDisallow: /\n");
  let headers = "";
  try {
    headers = await readFile(join(root, "_headers"), "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (!headers.includes("X-Robots-Tag: noindex, nofollow"))
    await writeFile(
      join(root, "_headers"),
      headers + "\n/*\n  X-Robots-Tag: noindex, nofollow\n",
    );
}
await applySearchPolicy(process.argv[2]);
