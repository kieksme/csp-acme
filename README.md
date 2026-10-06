# csp-acme

Eigenständige Customer-Service-Portal-Instanz für **einen Kunden: Acme**. Erstellt mit `@kieksme/csp-cli@0.3.0`, verwendet veröffentlichte CSP-Pakete aus [kieksme/csp](https://github.com/kieksme/csp). Keine Workspace-Verweise und keine Kopie des Produktkerns. Die Kundeninstanz hat eine eigene Versionsnummer; die CSP-Abhängigkeiten sind auf `0.3.0` festgelegt.

## Lokale Demo starten

Voraussetzungen: Node 22.12+ und pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
pnpm check
pnpm dev:api # Terminal 1: http://localhost:3001
pnpm dev     # Terminal 2: http://localhost:5173
```

Die Beispielkonfiguration aktiviert ausdrücklich `CSP_DEMO=true`. Personen, Schichten, Alerts, Status und Chat sind synthetisch; es werden keine Provider-Zugänge benötigt. Hotline und Ticketadressen sind Platzhalter und müssen vor dem Produktivbetrieb ersetzt werden. Für die gebaute Demo: `pnpm start:api` und in einem zweiten Terminal `pnpm preview` (http://localhost:4173).

## Branding und Naming

Die versionierte Datei [`.env.branding`](.env.branding) enthält die gemeinsamen öffentlichen Acme-Defaults. Frontend und API lesen sie über `customer.config.ts`; Umgebungsvariablen können alle Werte überschreiben.

| Einstellung             | Acme-Beispiel / Wirkung                                            |
| ----------------------- | ------------------------------------------------------------------ |
| `package.json` → `name` | `csp-acme`: technischer npm-/Repository-Name                       |
| `CSP_NAME`              | `Acme Service Portal`: sichtbarer Portalname, HTML-Titel, PWA-Name |
| `CSP_TAGLINE`           | Acme-Hauptüberschrift                                              |
| `CSP_DESCRIPTION`       | Beschreibung für Portal und PWA                                    |
| `CSP_COLOR`             | `#f97316`: orange Akzentfarbe                                      |
| `CSP_BACKGROUND`        | `#111827`: dunkler Hintergrund und PWA-Farbe                       |
| `CSP_CONTACT_LABEL`     | `Acme Support-Hotline`                                             |
| `CSP_CONTACT_PHONE`     | Fiktiver Kontakt; für den Kunden ersetzen                          |
| `CSP_ICON_PATH`         | `public/acme-icon.svg`: erzeugt PWA-Icons                          |
| `CSP_LOGO_URL`          | Standard: `<CSP_BASE_PATH>acme-logo.svg`; optional eigene URL      |
| `CSP_CONTENT_PATH`      | `content.json`: Acme-Prozesse, Ticketlinks und FAQ                 |
| `CSP_BASE_PATH`         | `/`, alternativ `/csp-acme/` bei Hosting im Unterpfad              |
| `CSP_DOMAIN`            | Öffentliche Origin für den Canonical-Link                          |
| `CSP_API_URL`           | Öffentliche API-Origin, ohne `/api/v1`                             |

Hex-Farben in `.env`-Dateien in Anführungszeichen schreiben. Eigene Bilder gehören in `public/`. Das mitgelieferte Logo folgt dem Basispfad automatisch; bei einer expliziten `CSP_LOGO_URL` den Basispfad selbst berücksichtigen. Die Icons werden beim Build neu generiert.

Frontend-Priorität: `.env.branding` → `.env` → `.env.local` → `.env.<mode>` → `.env.<mode>.local` → Prozessvariablen. API-Priorität: `.env.branding` → `.env` → `.env.local` → Prozessvariablen. Der API-Service lädt `.env.production` nicht automatisch.

Branding-, Naming- und Inhaltsänderungen erfordern einen neuen Frontend-Build und einen API-Neustart. Der technische Paketname ersetzt keine Branding-Konfiguration.

## Produktive Kundeninstanz

[`.env.production.example`](.env.production.example) zeigt öffentliche Produktionswerte einschließlich eines Naming-Overrides. [`.env.api.example`](.env.api.example) enthält die separat zu konfigurierenden API-Runtime-Werte.

1. Lokale Demo-`.env` und `.env.local` entfernen bzw. außerhalb des Projekts sichern.
2. `.env.production.example` nach `.env.production` kopieren und Domain, API-Adresse und Hotline ersetzen. `CSP_DEMO=false` beibehalten.
3. `pnpm install --frozen-lockfile && pnpm check` ausführen. `dist/` beim gewünschten statischen HTTPS-Host ausliefern. DNS und Custom Domain dort separat einrichten.
4. Auf dem API-Host `.env.api.example` als `.env` verwenden, Platzhalter und Provider-Zugänge ersetzen. `CSP_ALLOWED_ORIGINS` auf die exakte Frontend-Origin setzen. `pnpm start:api` im Projektverzeichnis ausführen.

Für GitHub Pages unter einem Repository-Pfad `CSP_BASE_PATH=/csp-acme/` setzen. CI baut eine gekennzeichnete Demo und prüft das API-Image. Der separate Pages-Workflow veröffentlicht die statische Beispieldemo bei Pushes auf `main`; produktive API-Instanzen werden separat betrieben. Produktionswerte lassen sich auch als Prozessvariablen beim Build setzen. Ein Frontend-Build überträgt keine Variablen an den API-Host.

Der API-Service kann mit dem enthaltenen `Dockerfile` gebaut werden:

```sh
docker build -t csp-acme-api .
docker run --rm --env-file .env.api -p 3001:3001 csp-acme-api
```

Dafür eine ausgefüllte `.env.api` aus `.env.api.example` erstellen. Das Image enthält `.env.branding`, `content.json` und `public/`, aber keine lokalen `.env`-Dateien oder Provider-Schlüssel. Der statische Frontend-Build wird separat gehostet. Für Inhalte aus `content.json` denselben Stand in Frontend und API verwenden.

API-Provider:

- SIGNL4: Acme-Team-ID und API-Schlüssel mit Leserechten konfigurieren.
- Uptime Kuma: URL und veröffentlichten Acme-Statusseiten-Slug konfigurieren.
- Chat: Ollama als Beispiel; OpenAI und Azure sind alternativ möglich. Das Ollama-Modell muss auf dem erreichbaren Ollama-Host vorhanden sein. `localhost` im Container bezeichnet den API-Container selbst.

Alle Provider-Schlüssel bleiben in der API-Runtime. Öffentliche Inhalte, Kontaktinformationen und Statusdaten dieser Instanz sind im Portal lesbar; der Chat verwendet die Quellen dieser Kundeninstanz. Keine Secrets in `.env.branding`, `.env.production`, `content.json` oder `VITE_*` ablegen.

## Plugins und weitere Kunden

Aktiviert sind Kontakt, SIGNL4, Uptime Kuma, Inhalte und Chat. `portal.plugins.json`, `portal.browser.ts`, `portal.server.ts` und Paketabhängigkeiten gehören zusammen. Mit der lokal gepinnten CLI verwalten:

```sh
pnpm exec csp plugin list
pnpm exec csp plugin remove @kieksme/csp-plugin-kuma
pnpm exec csp plugin add @kieksme/csp-plugin-kuma@0.3.0
pnpm check
```

Für einen weiteren Kunden dieses Repository kopieren, einen eigenen Repository-/Paketnamen setzen und `.env.branding`, Bilder, `content.json` sowie beide Produktionskonfigurationen anpassen. Jede Instanz betreibt ihre eigene API mit eigenen Provider-Zugängen. Gemeinsame Produktänderungen kommen durch neue CSP-Paketversionen.

Weitere Konfiguration: [CSP-Konfigurationsdokumentation](https://github.com/kieksme/csp/blob/main/docs/configuration.md).

## GitHub Pages und Repository-Template

Die veröffentlichte Acme-Demo ist für [kieksme.github.io/csp-acme/](https://kieksme.github.io/csp-acme/) vorbereitet. Der Workflow `.github/workflows/pages.yml` berücksichtigt automatisch Repository-Name und Owner.

Repository-Einstellungen: unter **Settings → General → Template repository** aktivieren; unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** wählen. Danach den Workflow **Publish Acme demo to GitHub Pages** starten oder auf `main` pushen.

GitHub Pages hostet ausschließlich statische Dateien. Nur der Pages-Build aktiviert `VITE_CSP_STATIC_DEMO=true` zusammen mit `CSP_DEMO=true`. `pages-demo.ts` liefert lokal fiktive Personen, Schichten, Alerts, Systemstatus, Kontakt-Downloads und eine feste, als Demo erklärte Chat-Antwort. Es gibt keine echten Provider-Aufrufe oder KI-Antworten. Normale Kundenbuilds verwenden weiterhin die konfigurierte API. Für eine produktive Instanz das Pages-Demo-Deployment deaktivieren und echte Frontend-/API-Konfiguration verwenden.
