# Zuordnung der Markenwerte

Die Pfade sind relativ zum Kundenrepository. Vor Änderungen immer die aktuelle
Implementierung lesen; eine später aktualisierte CSP-Version kann zusätzliche
Einstellungen anbieten.

| Datei                         | Zu prüfende Markenwerte                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `package.json`                | `name` für den technischen Instanznamen; CSP-Paketnamen beibehalten                  |
| `.env.branding`               | Portalname, Claim, Beschreibung, Farben, Kontaktlabel, Hotline, Iconpfad             |
| `customer.config.ts`          | Logo-Fallback mit `CSP_BASE_PATH` und passendem Dateinamen                           |
| `public/*`                    | Wortmarke, SVG-Farben und Beschriftung, PWA-Icon; keine verwaisten alten Assets      |
| `.env.example`                | Lokale Demo; keine echten Zugangsdaten und keine ungewollten Naming-Overrides        |
| `.env.production.example`     | Naming-/Hotline-Overrides, Portal-/API-Domain, Basispfad und Logo-Overrides          |
| `.env.api.example`            | Kunden-Origin, API-Adresse, Hotline, Provider-Platzhalter und Statusseiten-Slug      |
| `content.json`                | Kundentexte, Ticketnamen/-URLs, Prozesse, FAQ; vorhandenes Schema erhalten           |
| `pages-demo.ts`               | Fiktive Systemnamen, Meldungen, Chat-Text und zusammengehörige Personen-/Schicht-IDs |
| `.github/workflows/ci.yml`    | Anzeigename und gegebenenfalls kundenspezifische Artifact-/Image-Namen               |
| `.github/workflows/pages.yml` | Anzeigename; dynamische Owner-/Repo-Ausdrücke erhalten; Demo-Modus beibehalten       |
| `README.md`                   | Repo-/Portalname, Markenbeispiele, Assetpfade, Domains und Demo-Link                 |

## Beispiel-Markenbrief

```text
Marke: Northwind
Repository/Paket: csp-northwind
Portalname: Northwind Service Portal
Claim: Ihr Team für einen zuverlässigen Betrieb.
Beschreibung: Support, Systemstatus und Serviceinformationen für Northwind.
Akzentfarbe: #2563eb
Hintergrundfarbe: #0f172a
Kontaktlabel: Northwind Support-Hotline
Logo/Icon: bereitgestellte Assets; sonst ausdrücklich vorläufiges Beispiel-SVG
Hotline/Ticket-/API-Domain: noch offen, Platzhalter beibehalten
Modus: lokale Demo und statische GitHub-Pages-Demo
```

## Konfigurationspriorität

Frontend: `.env.branding` → `.env` → `.env.local` → `.env.<mode>` →
`.env.<mode>.local` → Prozessvariablen.

API: `.env.branding` → `.env` → `.env.local` → Prozessvariablen.

`CSP_NAME` in `.env.production.example` ist ein absichtlicher Override. Passe ihn
an die neue Marke an oder entferne ihn, wenn künftig überall der gemeinsame
Default gelten soll. Benenne die Entscheidung in der Dokumentation.

## Grenzen

- GitHub Pages liefert statische Dateien. Die Pages-Demo verwendet lokale
  Antworten; echte Provider benötigen einen separat betriebenen API-Service.
- Der Skill benennt das aktuelle GitHub-Repository nicht automatisch um und
  schaltet keine Betriebsart ohne entsprechenden Auftrag um.
- Repository-Beschreibung, Template-Status, Pages-Aktivierung und DNS sind keine
  Quelldatei-Einstellungen. Ändere sie nur über dafür verfügbare Funktionen,
  wenn der Nutzer dies beauftragt hat; melde fehlenden Zugriff.
- Reale Kontaktdaten und Provider-Konfigurationen werden nicht aus der Acme-Demo
  abgeleitet. Platzhalter bleiben erkennbar, bis der Kunde Werte liefert.
