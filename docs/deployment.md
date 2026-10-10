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

## CSP 0.7.0

Die Instanz verwendet CSP 0.7.0. Kunden-Stylesheets, Profil-Assets und die Chat-/Bereitschaftsdarstellung kommen aus den veröffentlichten Paketen; die bisherigen Produkt-Patches entfallen.
Der verbleibende CLI-Patch betrifft ausschließlich den API-Docker-Build: `curl` für den bestehenden HTTP-Healthcheck und die Patch-Datei vor der Produktionsinstallation bleiben enthalten.
