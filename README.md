# Acme Service Portal

Eigenständige Kundeninstanz mit veröffentlichten CSP-Paketen **0.4.0**. Branding, Inhalte und Plugins sind deklarativ konfiguriert; Browser-, API- und Build-Code kommen aus Core und CLI.

## Dateien

- `portal.config.json`: Acme-Branding, Farben, Logo/Icon, Hotline und alle fünf Plugins. Standardmäßig kein Demo-Modus.
- `portal.demo.json`: statische synthetische Pages-Demo ohne API oder Provider-Secrets.
- `content.json`: bestehende Acme-Prozesse, FAQ und Ticketlinks.
- `public/`: bestehende Acme-Logos; referenzierte Assets werden mit basispfadabhängigen URLs ausgeliefert.
- `.env.example`: lokale API-Demo; `.env.production.example` und `.env.api.example`: getrennte öffentliche Build- und API-Runtime-Beispiele.

## Lokal starten

Node.js >= 22.12 und pnpm 12.8.1:

```sh
pnpm install --frozen-lockfile
cp .env.example .env
pnpm check
pnpm dev
```

`dev` startet Frontend und API gemeinsam. `.env.example` aktiviert synthetische API-Daten. `pnpm build` baut das Standardprofil, `pnpm start` startet die gebaute API; das statische Frontend unter `dist/` wird separat gehostet. Profil- und Plugin-Änderungen erfordern einen Neustart bzw. erneuten Build.

`pnpm check` validiert beide Profile und baut Standard- sowie Demo-Frontend und API. Am Ende enthalten `dist/` und `dist-api/` den Demo-Build. Vor einem produktiven Deployment ausdrücklich das Standardprofil neu bauen.

## Branding und Overrides

Acme-Name, Claim, Beschreibung, Akzentfarbe `#f97316`, Hero-/PWA-Farbe `#111827` und Hotline stehen in den beiden JSON-Profilen. Branding-Änderungen, die beide Betriebsarten betreffen, in beiden Profilen vornehmen. `branding.logoFile` und `branding.iconFile` verweisen auf lokale Assets; Core erzeugt die PWA-Icons. `theme.tokens` und `darkTokens` steuern das Design. `contentFile` referenziert die gemeinsame Inhaltsdatei.

Öffentliche `CSP_*`-Overrides überschreiben Profilwerte. Frontend: Profil → `.env` → `.env.local` → `.env.<mode>` → `.env.<mode>.local` → Prozessvariablen. API: Profil → `.env` → `.env.local` → Prozessvariablen. Der API-Service lädt `.env.production` nicht automatisch. Branding- und Inhaltsänderungen benötigen einen Frontend-Build und API-Neustart.

Optional `avatarsFile` in beiden Profilen setzen. Das Schema lautet `{ "ids": { "provider-id": "public/avatars/person.webp" }, "names": {} }`. IDs haben Vorrang; lokale referenzierte Bilder erhalten automatisch den jeweiligen Basispfad. Die gemeinsame statische Demo verwendet `demo-lena` und `demo-noah`; produktiv gelten SIGNL4-IDs.

## Produktion

Die Hotline und Ticketadressen sind weiterhin Platzhalter. Lokale Demo-`.env` außerhalb des Projekts sichern; `.env.production.example` nach `.env.production` kopieren und echte öffentliche Werte konfigurieren. Provider-Secrets ausschließlich in der API-Runtime setzen, etwa anhand `.env.api.example`.

```sh
pnpm exec csp validate --production
pnpm exec csp build --production
pnpm start
```

`CSP_DEMO=false` beibehalten. Frontend unter `dist/` separat ausliefern. Das API-Image wird mit dem gemeinsamen Dockerfile gebaut:

```sh
pnpm exec csp build --production
mkdir -p .csp
cp node_modules/@kieksme/csp-cli/runtime/Dockerfile .csp/Dockerfile
printf 'node_modules\n.git\n.env\n.env.*\ndist\n.csp\n' > .csp/Dockerfile.dockerignore
docker build -f .csp/Dockerfile --build-arg PORTAL_CONFIG=portal.config.json -t csp-acme-api .
docker run --rm --env-file .env.api -p 3001:3001 csp-acme-api
```

`.env.api` vorher aus `.env.api.example` mit echten Runtime-Werten erstellen. `CSP_ALLOWED_ORIGINS` muss zur Frontend-Origin passen. SIGNL4, Kuma und Chat benötigen echte Provider-Konfiguration; das Ollama-Modell muss auf dem erreichbaren Host vorhanden sein. `localhost` im Container bezeichnet den API-Container.

## GitHub Pages

```sh
pnpm build:demo
```

Die [Acme-Demo](https://kieksme.github.io/csp-acme/) nutzt `public.demo: true` und `public.staticDemo: true`. Core liefert synthetische Personen, Schichten, Systemstatus und einen ausdrücklich als Demo gekennzeichneten Chat ohne Provider-Aufrufe.

Der Workflow `.github/workflows/deploy.yml` prüft beide Builds und ruft den gemeinsamen, auf eine CSP-Commit-SHA fixierten Build-Workflow auf. Pushes auf `main` veröffentlichen die Demo; Pull Requests prüfen Frontend und API-Image. Öffentliche Pages-URLs werden aus Repository-Name und Owner abgeleitet. Pages muss in den Repository-Einstellungen auf GitHub Actions stehen. Das Workflow-API-Image gehört zum Demo-Profil; produktives API-Hosting separat einrichten.

## Plugins und weitere Marken

```sh
pnpm exec csp plugin list
pnpm exec csp plugin remove @kieksme/csp-plugin-kuma
pnpm exec csp plugin add @kieksme/csp-plugin-kuma@0.4.0
```

Plugin-Befehle ändern das ausgewählte Profil (`--config portal.demo.json` für die Demo). Beide Profile auf die gewünschte Plugin-Auswahl abstimmen und neu bauen. CSP-Paketversionen gemeinsam aktualisieren und das Lockfile einchecken.

Der Repository-Skill [create-csp-brand](.agents/skills/create-csp-brand/SKILL.md) unterstützt neue Kundenmarken mit JSON-Profilen. Nach einer Template-Kopie Paketnamen, beide Profile, Inhalte, Assets und Konfigurationsbeispiele anpassen. Der Workflow berücksichtigt Owner und Repository-Namen automatisch.

## Migration von 0.3.0

Die bisherigen `.env.branding`, `customer.config.ts`, Startdateien, Plugin-Registrierungen, Vite-/TypeScript-Konfiguration und Dockerfile wurden durch Profile und CSP-CLI ersetzt. Inhalte, Logos, öffentliche Markenwerte und alle fünf Plugins bleiben erhalten. Die eigene `pages-demo.ts` entfällt: Die drei bisherigen Beispielpersonen, Beispielmeldung und feste Chat-Antwort werden durch die gemeinsame Core-Demo ersetzt. Diese synthetischen Demodaten sind nicht kundenspezifisch konfigurierbar. CSP 0.4.0 unterstützt den vCard-Download nur über die API; der Kontakt-Download in der statischen Pages-Demo ist gegenüber der bisherigen Acme-Demo nicht verfügbar. Die Kundenversion ist unabhängig von der CSP-Version.

Weitere Informationen: [CSP-Konfiguration](https://github.com/kieksme/csp/blob/main/Docs/configuration.md).
