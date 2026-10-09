# Hosted Acme chat

The frontend remains a static site. `portal.hosted.json` connects it to
`https://csp-acme.kieks.me`; unlike `portal.demo.json`, it does not use the
browser mock. The API retains synthetic contacts, shifts and status data via
`CSP_DEMO=true`, while `CSP_CHAT_DEMO=false` enables real OpenAI responses.
Real customer providers and ticket destinations are not configured yet.

Use the repository's private `ghcr.io/kieksme/csp-acme-api` image in Coolify.
The workflow publishes an immutable full-commit tag and `latest` on main builds.
Expose internal port 3001, configure HTTPS and a GET `/health` check expecting 200.
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
