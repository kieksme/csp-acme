---
name: create-csp-brand
description: >-
  Personalize a customer repository created from kieksme/csp-acme for a new
  brand. Use when the user asks to replace Acme branding, change portal naming,
  colors, logo or PWA icons, or configure a new customer's identity after using
  the CSP repository template. Covers public branding, customer content,
  configuration examples and the static GitHub Pages demo.
---

# Neue Kundenmarke für das CSP-Template

Erstelle eine konsistente Kundenmarke im **aktuellen Kundenrepository**. Das
Acme-Repository ist die Vorlage; der Produktkern kommt aus den veröffentlichten
`@kieksme/csp-*`-Paketen. Passe die Instanz an und führe die verfügbaren Prüfungen
bis zu einem nachvollziehbaren Ergebnis durch.

## 1. Repository und Markenbrief prüfen

- Lies die geltenden `AGENTS.md`, `README.md`, `package.json`, `.env.branding`,
  `customer.config.ts`, `vite.config.ts`, `server.ts`, `content.json`, die drei
  versionierten `.env*.example`-Dateien, `pages-demo.ts` und beide Workflows.
- Prüfe Git-Status und Remote. Übernimm vorhandene Änderungen des Nutzers; arbeite
  im Kundenrepo. Das Anwenden dieses Skills auf die Acme-Vorlage selbst ist nur
  dann vorgesehen, wenn der Nutzer ausdrücklich deren Marke ändern möchte.
- Ermittle aus dem Auftrag Markenname, technischen Paketnamen, Portalname,
  Claim, Beschreibung, Akzent- und Hintergrundfarbe, Logo/Icon sowie Kontakt-
  und Ticketangaben. Ziehe bereitgestellte Markenrichtlinien und Assets heran.
- Nutze angegebene Werte unmittelbar. Fehlen optionale Gestaltungsdetails,
  wähle nachvollziehbare Defaults und benenne sie im Ergebnis. Frage nur nach
  Informationen, ohne die der gewünschte Auftrag nicht sinnvoll umgesetzt
  werden kann. Erfinde keine echten Telefonnummern, Ansprechpartner oder Domains;
  unbekannte Betriebswerte bleiben klar gekennzeichnete Platzhalter.
- Ermittle, ob eine statische Beispieldemo, eine produktive API-Instanz oder
  beides gewünscht ist. Eine reine Branding-Anfrage ändert den Betriebsmodus
  und die Plugin-Auswahl nicht.

Die konkrete Zuordnung steht in [Dateien und Einstellungen](references/branding-map.md).

## 2. Naming und öffentliche Defaults umsetzen

1. Setze `package.json.name` auf einen gültigen npm-Paketnamen, beispielsweise
   `csp-northwind`. Die Kundenversionsnummer bleibt unabhängig von den CSP-Paketen.
   Benenne das entfernte GitHub-Repository nur bei einem entsprechenden Auftrag um.
2. Aktualisiere in `.env.branding` `CSP_NAME`, `CSP_TAGLINE`, `CSP_DESCRIPTION`,
   `CSP_COLOR`, `CSP_BACKGROUND`, `CSP_CONTACT_LABEL` und gegebenenfalls
   `CSP_CONTACT_PHONE`. `CSP_NAME` steuert Portal-, HTML- und PWA-Namen.
3. Verwende sechsstellige Hex-Farben und zitiere sie in dotenv-Dateien:
   `CSP_COLOR="#2563eb"`. Prüfe Lesbarkeit, Kontrast und Fokusdarstellung.
   Die Schriftfarbe oder beliebige CSS-Tokens sind keine dokumentierten
   CSP-Konfigurationsvariablen; erfinde keine wirkungslosen Einstellungen.
4. Passe Naming- und Hotline-Overrides in `.env.production.example` und
   `.env.api.example` an dieselbe Marke an. Ein veraltetes `CSP_NAME` im
   Produktionsbeispiel würde die neuen Defaults beim Build überschreiben.
5. Lasse Paket-Scope, CSP-Versionen, Plugin-IDs und Plugin-Verträge unverändert,
   soweit der Auftrag keine Änderung daran verlangt. Ändere weder installierte
   `node_modules` noch den CSP-Produktkern für eine reine Markenanpassung.

## 3. Logo und PWA-Icon anpassen

- Nutze bereitgestellte Assets. Wenn keine vorliegen, ist ein einfaches,
  ausdrücklich als Beispiel bezeichnetes SVG mit der neuen Wortmarke geeignet.
- Lege Logo und Icon in `public/` ab, etwa `northwind-logo.svg` und
  `northwind-icon.svg`. Setze `CSP_ICON_PATH=public/northwind-icon.svg`.
- Passe den Logo-Fallback in `customer.config.ts` vom Acme-Dateinamen auf das
  neue Logo an. Erhalte die Ableitung aus `CSP_BASE_PATH`, damit `/` und ein
  Repository-Unterpfad funktionieren. Ein hartes `/northwind-logo.svg` in
  `.env.branding` würde diese automatische Ableitung umgehen.
- Bei einer ausdrücklich gewünschten externen oder eigenen `CSP_LOGO_URL`
  aktualisiere alle Beispiel-Overrides; lokale URLs enthalten den Basispfad.
- Verwende ein Icon mit ausreichend Rand für die maskierbare PWA-Version und
  ein Logo, das auf dem Portalhintergrund lesbar bleibt. Aktualisiere SVG-
  Wortmarke, Farben und zugängliche Beschriftungen. Entferne alte Acme-Assets
  erst, nachdem keine aktiven Referenzen mehr darauf zeigen.

## 4. Inhalte, Beispiele und Demo konsistent machen

- Überarbeite markenbezogene Texte, FAQ-Antworten, Prozessbeschreibungen,
  Ticketnamen und URLs in `content.json`. Erhalte das Schema und die Bedeutung
  der Inhalte. Prozesse/FAQ unterstützen Markdown; Ticketvorlagen einfachen Text.
- Passe Kunden-Domains, Statusseiten-Slug, Team-ID-Platzhalter und
  `CSP_ALLOWED_ORIGINS` in den Konfigurationsbeispielen an. Eine Origin enthält
  keinen Repository-Unterpfad. `CSP_API_URL` enthält kein `/api/v1`.
  Fehlende echte Adressen erhalten reservierte Beispiel-Domains wie
  `tickets.northwind.example`.
- Aktualisiere die Markenbezüge in `pages-demo.ts`: Namen der Systeme,
  Alert-Texte, Chat-Antwort und gegebenenfalls synthetische Personen-IDs.
  Halte Team-, Schicht- und vCard-Referenzen konsistent. Demo-Daten bleiben
  fiktiv; die feste Chat-Antwort ist weiterhin als Demo erkennbar.
- Aktualisiere README-Titel, Markenbeispiele, Assetpfade, Repository- und
  Demo-Links sowie Workflow-Anzeigenamen. Erhalte allgemeine CSP-Upstream-Links.
  Die historische Herkunft aus der Acme-Vorlage darf erwähnt bleiben.
- Der Pages-Workflow leitet Owner und Repository-Name bereits aus GitHub ab.
  Erhalte diese Ausdrücke. Passe sie nur für ausdrücklich gewünschte Custom
  Domains oder abweichendes Hosting an. Eine Domain-Variable richtet kein DNS ein.
- Belasse `CSP_DEMO=true` und `VITE_CSP_STATIC_DEMO=true` ausschließlich für
  die statische Pages-Demo. Produktionsbeispiele behalten `CSP_DEMO=false`.
  Der API-Service lädt `.env.production` nicht automatisch.
- Provider-Schlüssel gehören nur in die API-Runtime. Lies oder zeige keine
  Secret-Werte und committe keine privaten dotenv-Dateien. Ändere bestehende
  lokale Runtime-Konfigurationen nur im beauftragten Umfang; weise auf Overrides
  hin, die die neue Marke überlagern könnten.

## 5. Ergebnis prüfen

1. Suche nach alten Markenreferenzen, ohne private dotenv-Dateien oder
   `node_modules` zu durchsuchen. Prüfe gezielt die oben genannten Quelldateien,
   Beispielkonfigurationen und `public/`. Unterscheide historische Template-
   Verweise von versehentlich übrig gebliebenen aktiven Markenwerten.
2. Prüfe den Diff: Markenname, technische Namen, Logo/Icon, Hotline und
   Produktions-Overrides passen zusammen. Assetpfade existieren; Inhalte
   bleiben valide. Eine reine Markenänderung aktualisiert keine CSP-Abhängigkeiten.
3. Führe `pnpm install --frozen-lockfile` und `pnpm check` aus. Für einen
   Pages-Build setze zusätzlich `CSP_DEMO=true`,
   `VITE_CSP_STATIC_DEMO=true`, einen Repository-Unterpfad und eine API-Origin
   **derselben Frontend-Origin**, deren Pfad auf `/demo-api` endet; baue mit
   `pnpm exec vite build`.
4. Prüfe `dist/index.html`, `dist/manifest.webmanifest`, generierte Icons und
   kopiertes Logo: Titel, PWA-Name, Farben, Basispfad und Canonical-Link stimmen.
   Prüfe sowohl `/` als auch `/<repository-name>/`, wenn beide unterstützt werden.
5. Nutze für Builds mit abweichenden Konfigurationen einen temporären separaten
   Arbeitsstand mit den aktuellen Änderungen und ohne private dotenv-Dateien.
   Überschreibe oder entferne nicht die lokale Konfiguration des Nutzers.
6. Wenn eine Browserprüfung verfügbar ist, kontrolliere Desktop/Mobilansicht,
   Logo, Lesbarkeit, Navigation und den Demo-Modus. Prüfe die Pages-Demo ohne
   laufenden API-Service. Melde fehlende Browser- oder Deployment-Prüfungen klar.

Veröffentlichung, Remote-Änderungen und Repository-Einstellungen folgen dem
Auftrag des Nutzers und den geltenden Repository-Regeln. Nach Veröffentlichung
prüfe den Workflow, sofern Zugriff besteht. Behaupte keine erfolgreiche Änderung
an GitHub-Einstellungen oder kein Live-Deployment ohne entsprechende Bestätigung.

## Ergebnis mitteilen

Nenne die umgesetzte Marke, wesentliche Dateien, Prüfungen und noch offene echte
Betriebswerte. Beschreibe kurz, ob die Instanz als Demo oder produktiv konfiguriert
ist. Verlinke einen erstellten Commit/PR oder die verifizierte Veröffentlichung,
wenn dies Teil des Auftrags war.
