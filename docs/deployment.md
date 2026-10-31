# Hosted Acme chat

The frontend remains a static site. `portal.hosted.json` connects it to
`https://csp-acme.kieks.me`; unlike `portal.demo.json`, it does not use the
browser mock. The API retains synthetic contacts, shifts and status data via
`CSP_DEMO=true`, while `CSP_CHAT_DEMO=false` enables real OpenAI responses.
Real customer providers and ticket destinations are not configured yet.

Use the repository's private `ghcr.io/kieksme/csp-acme-api` image in Coolify.
The workflow publishes an immutable full-commit tag and `latest` on main builds.
Expose internal port 3001 and configure HTTPS. In Coolify, use the healthcheck
type **HTTP** with method `GET`, path `/health`, host `localhost`, port `3001` and
expected status `200`. Set interval to 30 seconds, timeout to 5 seconds and start
period to 15 seconds. The runtime image includes `curl` for this container check.
Coolify 4.4.6 rejects inline JavaScript in custom container commands, so a
`node -e` check cannot be saved there. Healthchecks confirm API readiness; they do
not confirm OpenAI authentication.

For `portal.support.json`, enable **Consistent Container Names** in Coolify's
advanced application settings. The support runtime holds an exclusive PostgreSQL
lock: only one API instance may use its database. This setting makes Coolify stop
the previous container before starting its replacement. Expect a short API
interruption during deployment; the static frontend remains available. A rolling
update starts both instances together and fails with
`Only one CSP support runtime may use this database`.

After deployment, verify `/health`, the running image's immutable commit tag and
digest, and the installed `@kieksme/csp-core` version. If startup fails, redeploy
the previous immutable image tag and check readiness again.

Use `.env.hosted.example` as runtime settings. Replace the dummy API key separately
for each customer; never provide a real key to a frontend build. A dummy key allows
API startup but OpenAI requests fail until replaced. Redeploy after key changes.
DNS must point the customer subdomain to the hosting server before HTTPS works.

Acme's GitHub Pages frontend is published by the existing workflow. For NetCom BW
and Thinkport, Pages remains opt-in through `CSP_PAGES_ENABLED=true` if the GitHub
plan supports private-repository Pages. Otherwise host `customer-frontend` on an
appropriate static host and update `CSP_ALLOWED_ORIGINS` to its actual origin.
Adding an allowed browser origin does not authenticate API callers.

`portal.config.json` remains the live-provider configuration; its real credentials
and contacts must be supplied separately. `portal.demo.json` remains a fully static
demo. Each container loads only its own customer configuration and sources.

## Historisch: Umstellung auf CSP 0.9.0

Mit CSP 0.9.0 wurden die zuvor lokalen Patches abgelöst. Kunden-Stylesheets, Profil-Assets und die Chat-/Bereitschaftsdarstellung kommen aus den veröffentlichten Paketen; die bisherigen Produkt-Patches entfallen.
CSP 0.9.0 liefert `curl` bereits im API-Dockerfile. Der bisherige CLI-Patch entfällt; die Instanz verwendet wieder ausschließlich veröffentlichte Pakete.

## Optionaler Slack-Support

Das Slack-Paket ist in allen Profilen registriert. Die Demo- und KI-Profile aktivieren keine Übertragung; `portal.support-demo.json` bietet die lokale Übernahme-Demo. Die veröffentlichte Webseite und API verwenden `portal.support.json` für den echten Slack-Support. [Profil-Erzeugung, Runtime und Live-Abnahme](slack-support.md).

## Offene Slack-Support-Webseite

Der Veröffentlichungsworkflow baut jetzt `portal.support.json` mit anonymen Besuchersitzungen, ohne Microsoft-Login. Die passende API-Runtime steht in `.env.slack.example`; siehe [Slack-Support](slack-support.md). Das bisherige `portal.hosted.json` bleibt als eigenständiges Profil für reinen KI-Chat verfügbar.

## Datadog-Demo und CSP 0.15.1

Alle CSP-Pakete verwenden Version 0.15.1. Der Acme-Workflow verwendet dieselben CSP-CLI-Validierungs- und Build-Befehle und baut beide API-Images über den gemeinsamen [Image-Helper](ci-image-build.md). Die zusätzliche statische Datadog-Demo wird vom Check-Job separat gebaut und beim Pages-Deployment unter `datadog/` in das bestehende Supportportal eingefügt. Beide Frontends werden gemeinsam als ein Pages-Artefakt veröffentlicht. Das API-Image verwendet weiterhin ausschließlich `portal.support.json`; die statische Datadog-Demo aktiviert keine zusätzlichen Provider-Routen im produktiven Support-API-Prozess. [Demo, Konto-Status und lokale Befehle](datadog-demo.md).

## Datadog Live-Profil

CSP 0.14.1 korrigiert die im EU1-Live-Test gefundenen Antwortformate. Die Pipeline
baut zusätzlich `portal.datadog-hosted.json`, veröffentlicht sein Frontend unter
`datadog-live/` und das private Image `ghcr.io/kieksme/csp-acme-datadog-api`.
Es erhält eine eigene Coolify-Anwendung am HTTPS-Pfad `/datadog-api`, interne
Portnummer 3001, HTTP-Healthcheck `/health` und `CSP_DEMO=false`.
Die serverseitige Konfiguration basiert auf `.env.datadog.example`, mit
`CSP_HOST=0.0.0.0`, `CSP_PORT=3001` und
`CSP_ALLOWED_ORIGINS=https://kieksme.github.io`. Coolifys Strip-Prefix-Einstellung
muss aktiv sein. Das Support-Image und seine Runtime bleiben getrennt.
[Ressourcen, Abnahmestand und Rollout](datadog-live.md).

## API-Image-Mirror

Ein gezielter CLI-0.15.1-Patch zieht das offizielle Node-22-Image für beide Docker-Stufen per Digest von ECR Public und kopiert die Patch-Dateien vor der Produktionsinstallation. Die veröffentlichte CLI liefert `curl` weiterhin selbst. [Build und Grenzen](ci-image-build.md).

Alle acht Acme-Profile konfigurieren das [Swetrix-Plugin](analytics.md). Die Projekt-ID ist öffentlich; administrative API-Schlüssel werden nicht in Builds übernommen.

## MCP

API-MCP, Konfiguration und Abnahme: [MCP](mcp.md).

## Suchmaschinensteuerung

`scripts/search-policy.mjs` ergänzt nach jedem Standard-, Demo- und Hosting-Build in allen HTML-Dateien `noindex, nofollow`, schreibt `robots.txt` mit `User-agent: *` / `Disallow: /` und ergänzt `_headers` für unterstützende statische Hosts. Diese Übergangslösung benötigt kein Upgrade der festgelegten CSP-Pakete. Direkte eigene Aufrufe von `csp build` anschließend ebenfalls mit `node scripts/search-policy.mjs` abschließen.

Die erzeugte `robots.txt` muss unter **`https://<domain>/robots.txt`** mit HTTP 200 und Textinhalt erreichbar sein. Bei Unterpfad-Hosting (etwa GitHub Pages) muss der Betreiber dieselbe Datei zusätzlich im Domain-Root veröffentlichen; eine Datei nur im Projekt-Unterpfad reicht nicht. GitHub Pages verarbeitet `_headers` nicht. Andere Hosts müssen `X-Robots-Tag: noindex, nofollow` über ihre Header-Konfiguration setzen, wenn sie `_headers` nicht unterstützen.

Dies ist Suchmaschinensteuerung, keine Zugriffssperre. `Disallow: /` kann das Lesen von `noindex` verhindern; bestehende Suchtreffer verschwinden dadurch nicht garantiert. Live-Abnahme: initiales HTML, Root-robots.txt, HTTP-Status und ggf. Header separat prüfen.
