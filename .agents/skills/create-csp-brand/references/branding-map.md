# Dateien und Einstellungen ab CSP 0.4.0

Alle Pfade beziehen sich auf das Kundenrepository.

| Datei | Markenwerte |
| --- | --- |
| `package.json` | Technischer Name, unabhängige Kundenversion; CSP-Pakete beibehalten |
| `portal.config.json`, `portal.demo.json` | `branding`, `theme.tokens`, `darkTokens`, `contact`, Plugin-Auswahl |
| `branding.logoFile`, `branding.iconFile` | Lokale Assets; Core löst Basispfade auf und erzeugt PWA-Icons |
| `content.json` | Prozesse, FAQ, Ticketnamen und Links; Schema erhalten |
| `avatars.json` | `{ "ids": { "provider-id": "public/avatars/person.webp" }, "names": {} }`; über `avatarsFile` referenziert |
| `public/` | Referenzierte Logos, Icons und Fotos; keine automatische Auslieferung sämtlicher Dateien |
| `.env.example` | Lokale API-Demo und Runtime-Beispiele |
| `.env.production.example` | Öffentliche Naming-/Hotline-/Domain-Overrides |
| `.env.api.example` | Origin, API-Adresse, Hotline und Provider-Platzhalter |
| `.github/workflows/deploy.yml` | Anzeigename, SHA-fixierter gemeinsamer Build, dynamische Pages-URLs |
| `README.md` | Marke, Assets, Betriebsarten, Overrides und Prüfungen |

Die frühere `.env.branding`, `customer.config.ts`, `pages-demo.ts` und eigene
Vite-/TypeScript-Startdateien sind durch Profile, Core und CLI ersetzt.

Frontend-Priorität: Profil → `.env` → `.env.local` → `.env.<mode>` →
`.env.<mode>.local` → Prozessvariablen. API: Profil → `.env` → `.env.local` →
Prozessvariablen. Die API lädt `.env.production` nicht automatisch.

`CSP_NAME`, `CSP_COLOR`, `CSP_BACKGROUND`, `CSP_CONTACT_PHONE`, `CSP_API_URL` und
weitere dokumentierte öffentliche Overrides können Profilwerte überlagern.
Farben in dotenv-Dateien zitieren. Für zusätzliche Design-Tokens Profilfelder
verwenden; keine unberücksichtigten Konfigurationsvariablen erfinden.

`public.demo` aktiviert synthetische API-Daten; zusätzlich `staticDemo` aktiviert
die statische Browser-Demo ohne API. Core-Demoinhalte sind nicht markenspezifisch
konfigurierbar. Die statischen Demo-IDs lauten `demo-lena` und `demo-noah`.

Open Graph ist eine optionale Kunden-Build-Erweiterung: tatsächliches 1200 × 630
PNG erstellen, explizit nach `dist/` kopieren und gebaute HTML-Metadaten über einen
Nachbearbeitungsschritt ergänzen. Derselbe Schritt muss in CI/Pages laufen.
Die CLI besitzt keinen kundeneigenen Vite-Plugin-Hook oder OG-Profilfelder.
Bild-URLs verwenden Frontend-Origin und Basispfad, niemals API-Origin.

Pages-Aktivierung, Repository-Template-Status und DNS sind separate Einstellungen;
nur auf entsprechenden Auftrag ändern und nicht ohne Bestätigung als erledigt
melden. Echte Betriebswerte nicht aus Acme-Daten ableiten.
