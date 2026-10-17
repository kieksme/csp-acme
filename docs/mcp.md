# MCP für AI Agents

Acme Support: `https://csp-acme.kieks.me/mcp`. Acme Datadog: `https://csp-acme.kieks.me/datadog-api/mcp`. Beide Server getrennt registrieren.

Dies sind Zieladressen nach Bereitstellung, keine bestätigten Live-Endpunkte. Einen MCP-Client mit Streamable HTTP verwenden. Bei gesetztem Token `Authorization: Bearer <MCP-Token>` senden. Die [Nutzeranleitung](https://github.com/kieksme/csp/blob/main/docs/mcp-client.md) enthält Codex-/VS-Code-Beispiele, Anfragen und Fehlermeldungen. [Tools und Argumente](https://github.com/kieksme/csp/blob/main/docs/mcp.md).

Alle eingecheckten Profile werden mit `pnpm test:mcp` gegen die tatsächlich installierten Core-Patches und synthetische Provider geprüft. `pnpm check` führt diesen Test ebenfalls aus.

API-Runtime: `CSP_MCP_ENABLED=true` registriert `/mcp`; Standard `false`, ausschließlich `true` oder `false` zulässig. Optional `CSP_MCP_TOKEN` als Secret mit mindestens 32 Zeichen setzen. Ohne Token sind nur öffentliche Plugin-Daten lesbar. Beide Optionen gelten zur Runtime, nicht beim Frontend-Build. Nach Konfigurationsänderung die API neu starten. Der Core-Backport wird durch `pnpm install --frozen-lockfile` angewendet und muss auch im API-Image enthalten sein. Statische Webseiten besitzen keinen MCP-Server.

Die Backend-Änderung bereitet die Funktion vor; tatsächliche Verfügbarkeit muss nach Image-Rollout und Runtime-Konfiguration abgenommen werden.
