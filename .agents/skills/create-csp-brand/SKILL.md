---
name: create-csp-brand
description: >-
  Personalize a CSP customer repository for a new brand. Covers portal naming,
  colors, logos, PWA icons, team avatars, Open Graph images, customer content,
  JSON configuration profiles and the static GitHub Pages demo. Ask for missing
  color, logo and avatar preferences before implementing the brand.
---

# Neue Kundenmarke für das CSP-Template

Arbeite im aktuellen Kundenrepository. Die gemeinsame Anwendung kommt aus
veröffentlichten `@kieksme/csp-*`-Paketen; ändere für Branding weder den Core noch
`node_modules`. Nutzerauftrag und geltende Repository-Regeln haben Vorrang.

## Bestand und Markenbrief

Lies `AGENTS.md`, Git-Status/Remote, `README.md`, `package.json`,
`portal.config.json`, `portal.demo.json`, `content.json`, die versionierten
`.env*.example`-Dateien und `.github/workflows/deploy.yml`. Erhalte vorhandene
Nutzeränderungen. Ändere die Marke der Acme-Vorlage selbst nur auf ausdrücklichen
Auftrag; normalerweise wird eine Kundenkopie angepasst.

Ermittle Marke, Paketname, Portalname, Claim, Beschreibung, Farben, Logo/Icon,
Avatar-Wünsche, Social-Vorschau und Betriebsart. Verwende bekannte Angaben sofort.
Frage nach offenen visuellen Entscheidungen, bevor du sie umsetzt; siehe
[Markenbrief](references/brand-interview.md). Arbeite währenddessen unabhängig
weiter. Erfinde keine realen Kontakte, Personen-IDs, Hotline oder Domains.
Unbekannte Betriebswerte bleiben gekennzeichnete Platzhalter. Eine Branding-
Änderung ändert nicht automatisch Betriebsart, Plugin-Auswahl oder Paketversionen.

## Profile und Naming

- Setze den technischen Namen in `package.json`; benenne das entfernte Repository
  nur auf entsprechenden Auftrag um. Kunden- und CSP-Versionen sind unabhängig.
- Aktualisiere in **beiden Profilen** `branding.name`, `tagline`, `description`,
  `contact.label`, `phone`, `theme.tokens` und gegebenenfalls `darkTokens`.
  Verwende sechsstellige Hex-Farben; prüfe Kontrast und Fokusdarstellung.
- Setze `branding.logoFile` und `iconFile` auf lokale Assets. Core erzeugt daraus
  Icons und löst referenzierte Assets passend zu `public.basePath` auf.
- Passe Naming-/Hotline-/Domain-Overrides in den Produktions- und API-Beispielen
  an. Overrides können Profilwerte überlagern; lies keine privaten dotenv-Dateien.
- Erhalte `public.demo: false` im Standardprofil und `demo: true`,
  `staticDemo: true` im Demo-Profil. Bei einer anderen ausdrücklich beauftragten
  Betriebsart ändere beide konsistent. `CSP_API_URL` enthält kein `/api/v1`;
  `CSP_ALLOWED_ORIGINS` enthält keine Repository-Unterpfade.

Details: [Dateien und Einstellungen](references/branding-map.md).

## Logo, Favicon und Splash

Nutze bereitgestellte oder ausdrücklich gewünschte Logo-Assets. Kläre bei einer
breiten Wortmarke eine kompakte Icon-Variante. Verwende dieselbe Markenquelle für
Portal und PWA-Icons, ohne Verzerrung und mit Rand für maskierbare Icons. Entferne
alte Acme-Assets erst nach Prüfung aller Referenzen.

Prüfe in `dist/` Favicon, `icon-192.png`, `icon-512.png`,
`icon-maskable-512.png` und Webmanifest. `theme.tokens.hero` bestimmt die Hero-/PWA-
Hintergrundfarbe. Der Betriebssystem-Splash verwendet die Manifest-Icons;
behaupte keine verifizierte Splash-Darstellung ohne Plattformprüfung. Ein eigener
Ladebildschirm oder Apple-Startup-Bilder erfordern eine ausdrücklich beauftragte
Erweiterung; die CLI besitzt keine kundeneigene Vite-Konfiguration.

## Avatare

Kläre Providerbilder, eigene Assets oder Initialen. Frage nach der Zuordnung,
rate keine SIGNL4-IDs. Lege lokale Bilder unter `public/avatars/` ab und setze
`avatarsFile: "avatars.json"` in beiden Profilen. Schema:

```json
{"ids":{"provider-id":"public/avatars/person.webp"},"names":{}}
```

IDs haben Vorrang; Namen werden normalisiert. Core erzeugt für referenzierte lokale
Bilder basispfadabhängige URLs. Die statische Core-Demo verwendet `demo-lena` und
`demo-noah`; produktiv gelten Provider-IDs. Entfernen eines Overrides deaktiviert
keinen Provider-Avatar. Initialen sind der Fallback ohne Bild. Prüfe Assets,
Mobilansicht und Zuordnung, ohne lokale API-Demodaten mit statischen Demodaten zu
verwechseln.

## Open Graph

Erstelle für die neue Marke ein tatsächliches PNG mit
1200 × 630 Pixeln, Logo, Markenfarben und lesbarem Portalnamen. Frage nur nach
noch offenen Motiven/Textwünschen. Prüfe das fertige Bild visuell.

CSP 0.4.0 stellt weder OG-Profilfelder noch einen eigenen Vite-Plugin-Hook bereit.
Erfinde keine `CSP_OG_*`-Variablen. Ergänze bei beauftragter OG-Einbindung einen
expliziten kundeneigenen Nachbearbeitungsschritt für **alle** relevanten Builds,
auch im CI-/Pages-Workflow. Er muss das PNG nach `dist/og-image.png` kopieren und
OG-/Twitter-Metadaten ins gebaute HTML schreiben. Die CLI liefert nur referenzierte
Assets aus und kopiert nicht automatisch jedes Bild unter `public/`.

Setze `og:type`, Titel, Beschreibung, URL, Bild, MIME-Typ, Breite, Höhe und Alttext
sowie `twitter:card=summary_large_image`, Titel, Beschreibung, Bild und Alttext.
Leite Titel/Beschreibung aus der aufgelösten öffentlichen Profilkonfiguration ab;
absolute HTTPS-URLs verwenden Frontend-Origin plus Basispfad, niemals API-Origin.
Ohne reale Frontend-Origin bleibt die Live-Verifikation offen. JavaScript-Metadaten
nach Seitenstart genügen Social-Crawlern nicht zuverlässig.

## Inhalte, Demo und Workflow

Passe Markenreferenzen in `content.json` an; erhalte Schema und Bedeutung der
Prozesse, FAQ und Ticketvorlagen. Passe Beispiel-Domains, Statusseiten-Slug,
Team-ID-Platzhalter und Origins an. Provider-Secrets gehören nur in die API-Runtime.

Die statische Demo wird durch Core erzeugt: keine `pages-demo.ts` oder
kundenspezifischen Demo-Personen/-Alerts vorhanden. Ändere keine Core-Demodaten im
Kundenrepo; erkläre diese Grenze, wenn individuelle Demo-Inhalte verlangt werden.
Der gemeinsame Workflow setzt Pages-Origin und Basispfad aus Owner/Repository.
Erhalte diese Ausdrücke und die unveränderliche Workflow-Commit-SHA. DNS, Pages-
Aktivierung und Template-Status sind Repository-Einstellungen, keine Profilwerte.

## Validierung

1. Prüfe Diff und Markenreferenzen in versionierten Quellen und Assets; historische
   Template-Verweise dürfen bleiben. Erhalte Paketverträge und Profil-Schemas.
2. Führe `pnpm install --frozen-lockfile` und `pnpm check` aus. Check validiert
   und baut Standard- sowie Demo-Profil. Die letzten Build-Artefakte sind die Demo;
   für ein produktives Deployment das Standardprofil ausdrücklich neu bauen.
3. Prüfe beide Builds auf HTML-/PWA-Titel, Farben, Basispfad, Canonical-Link,
   Logo, Icons und referenzierte Avatare. Bei OG auch PNG-Dimensionen und
   Metadaten prüfen. Nutze frische temporäre Arbeitsstände ohne private dotenv-
   Dateien, damit Nutzerkonfigurationen nicht überschrieben werden.
4. Prüfe nach Möglichkeit Desktop/Mobilansicht, Navigation, Kontakt-Downloads,
   Chat und statische Demo ohne API. Ungeprüfte Plattform-/Live-Eigenschaften
   ausdrücklich benennen; keine erfolgreiche Veröffentlichung behaupten.
5. Aktualisiere README und Konfigurationsbeispiele. Nenne umgesetzte Werte,
   Assets, Prüfungen und offene echte Betriebswerte. Verlinke erstellte PRs.

Veröffentlichung, Remote-Änderungen und Repository-Einstellungen richten sich
nach dem Nutzerauftrag und geltenden Regeln.
