import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { createServer } from "@kieksme/csp-core/server";
import { loadProfile } from "@kieksme/csp-core/profile";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const profiles = (await readdir(".")).filter((name) =>
  /^portal(?:\.[a-z-]+)?\.json$/.test(name),
);
const token = "test-only-mcp-token-012345678901234567890";
for (const profile of profiles)
  test(`MCP: ${profile}`, async () => {
    const loaded = loadProfile(resolve(profile), {
      CSP_DEMO: "true",
      CSP_CHAT_DEMO: "true",
    });
    const plugins = await Promise.all(
      loaded.profile.plugins.map(
        async (name) => (await import(name + "/server")).default,
      ),
    );
    const support =
      plugins.some((plugin) =>
        ["teams", "slack", "telegram"].includes(plugin.id),
      ) && loaded.config.chatSupport;
    const config = {
      ...loaded.config,
      ...(support ? { chatSupport: { mode: "demo" } } : {}),
    };
    const app = await createServer({
      plugins,
      config,
      env: {
        ...loaded.env,
        CSP_DEMO: "true",
        CSP_CHAT_DEMO: "true",
        CSP_TEAMS_ENABLED: "false",
        CSP_SLACK_ENABLED: "false",
        CSP_TELEGRAM_ENABLED: "false",
        CSP_TEAMS_DEMO: support ? "true" : "false",
        CSP_SLACK_DEMO: support ? "true" : "false",
        CSP_TELEGRAM_DEMO: support ? "true" : "false",
        CSP_MCP_ENABLED: "true",
        CSP_MCP_TOKEN: token,
      },
      fetch: async () => {
        throw new Error("Live provider access forbidden in MCP tests");
      },
    });
    const client = new Client({ name: "customer-test", version: "1.0.0" });
    try {
      assert.equal(
        (await app.inject({ method: "POST", url: "/mcp", payload: {} }))
          .statusCode,
        401,
      );
      await client.connect(
        new StreamableHTTPClientTransport(new URL("http://localhost/mcp"), {
          requestInit: { headers: { Authorization: "Bearer " + token } },
          fetch: async (url, init) => {
            const response = await app.inject({
              method: init?.method ?? "GET",
              url: new URL(String(url)).pathname,
              headers: Object.fromEntries(new Headers(init?.headers).entries()),
              payload: init?.body,
            });
            return new Response(
              [202, 204].includes(response.statusCode) ? null : response.body,
              { status: response.statusCode, headers: response.headers },
            );
          },
        }),
      );
      const { tools } = await client.listTools();
      const ids = plugins.map((plugin) => plugin.id);
      assert.ok(tools.some((tool) => tool.name === "portal_get_info"));
      for (const [id, prefix] of [
        ["contact", "contact_"],
        ["content", "content_"],
        ["signl4", "signl4_"],
        ["kuma", "kuma_"],
        ["datadog", "datadog_"],
      ])
        assert.equal(
          tools.some((tool) => tool.name.startsWith(prefix)),
          ids.includes(id),
          `${profile}: ${id}`,
        );
      for (const tool of tools) {
        assert.equal(tool.annotations.readOnlyHint, true);
        const result = await client.callTool({
          name: tool.name,
          arguments: {},
        });
        assert.notEqual(result.isError, true, tool.name);
        const data = JSON.parse(result.content[0].text);
        assert.notEqual(data?.stale, true, tool.name);
        if (tool.name === "portal_get_info") {
          assert.equal(data.name, loaded.config.name);
          assert.deepEqual([...data.plugins].sort(), ids.sort());
        }
      }
    } finally {
      await client.close();
      await app.close();
    }
  });
