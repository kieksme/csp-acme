---
name: create-csp-brand
description: >-
  Personalize a customer repository created from kieksme/csp-acme for a new
  brand. Use when the user asks to replace Acme branding, change portal naming,
  colors, logos, splash-screen/favicons or team avatars, or configure a new customer's identity after using
  the CSP repository template. Covers public branding, customer content,
  configuration examples and the static GitHub Pages demo. Interactively ask
  for missing color, logo and avatar preferences before implementing the brand.
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
- Nutze bereits angegebene Werte unmittelbar. Frage vor der visuellen Umsetzung
  interaktiv nach noch offenen Farben, Logo-Assets und Avatar-Wünschen. Lege
  diese Entscheidungen nicht stillschweigend durch Defaults fest. Die Fragen
  stehen in [Interaktiver Markenbrief](references/brand-interview.md).
- Bündele zusammengehörige Fragen in kurzen, verständlichen Gruppen und nutze
  ein verfügbares Frage-Tool für Text/Optionen. Bitte um Datei-Uploads im Chat,
  wenn das Frage-Tool keine Anhänge unterstützt. Arbeite währenddessen an
  unabhängiger Bestandsaufnahme weiter; noch offene Asset-Entscheidungen sind
  durch verstrichene Zeit nicht beantwortet.
- Frage nicht erneut nach eindeutig angegebenen Werten. Wenn der Nutzer
  ausdrücklich Defaults oder freie Gestaltung erlaubt, darfst du Vorschläge
  selbst umsetzen und benennst diese Entscheidung im Ergebnis. Erfinde keine
  echten Telefonnummern, Ansprechpartner oder Domains; unbekannte Betriebswerte
  bleiben klar gekennzeichnete Platzhalter.
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

## 3. Logo, Splash Screen und Favicon gemeinsam gestalten

- Frage nach dem vorhandenen Logo und gegebenenfalls einer kompakten Bildmarke.
  Nutze die vom Nutzer ausgewählten Assets. Ein Beispiel-SVG ersetzt ein
  Markenlogo nur, wenn der Nutzer eine vorläufige Gestaltung wünscht.
- Lege die ausgewählte Logoquelle in `public/` ab. Verwende sie auch als Quelle
  für Favicon und PWA-/Splash-Icons: `CSP_ICON_PATH` verweist auf das lokale Logo
  oder eine daraus abgeleitete quadratische Variante derselben Marke. Belasse
  keinen unabhängigen Acme- oder neutralen Icon-Fallback. Externe Logo-URLs
  benötigen zusätzlich ein lokal bereitgestelltes Asset für den Icon-Build.
- Frage bei einer breiten Wortmarke, ob die Bildmarke oder die vollständige
  Wortmarke im kleinen Icon erscheinen soll. Leite die quadratische Variante
  ohne Verzerrung ab, mit ausreichend Rand für das maskierbare Icon. Stimmen
  Logo und Hintergrund nicht zusammen, kläre eine passende Variante.
- Passe den Logo-Fallback in `customer.config.ts` auf das neue Asset an. Erhalte
  die Ableitung aus `CSP_BASE_PATH`, damit `/` und ein Repository-Unterpfad
  funktionieren. Ein hartes `/northwind-logo.svg` in `.env.branding` würde diese
  automatische Ableitung umgehen. Aktualisiere explizite Logo-Overrides ebenso.
- Der CSP-Build erzeugt aus `CSP_ICON_PATH` `icon-192.png`, `icon-512.png` und
  `icon-maskable-512.png`. Das HTML-Favicon referenziert `icon-192.png`; das
  Webmanifest referenziert die PWA-Icons. Prüfe diese Verbindung im tatsächlich
  installierten Paket und passe beide auf die gewählte Logoquelle an.
- Nutze für den installierten PWA-Splash Screen dasselbe Markenlogo über die
  Manifest-Icons und setze `CSP_BACKGROUND` auf die gewünschte Splash-Farbe.
  Ein Betriebssystem kann diese Darstellung selbst bestimmen. Das Template
  besitzt derzeit keinen eigenen App-Ladebildschirm: Behaupte nicht, dass ein
  Manifest-Icon automatisch einen solchen Bildschirm oder sämtliche iOS-
  Startup-Bilder erzeugt. Prüfe die gewünschte Zielplattform. Wenn explizite
  Apple-Touch-/Startup-Bilder oder ein eigener Ladebildschirm nötig sind,
  ergänze passende Assets und Einbindungen im Kundenprojekt, etwa über die
  Vite-HTML-Transformation; benutze ebenfalls dieselbe Logoquelle.
- Aktualisiere SVG-Farben, Wortmarke und zugängliche Beschriftungen. Entferne
  alte Acme-Assets erst, nachdem keine aktiven Referenzen mehr darauf zeigen.

## 4. Avatare interaktiv anpassen

- Frage, ob Provider-Avatare, eigene Fotos/Illustrationen oder Initialen verwendet
  werden sollen. Kläre, ob das für alle Personen oder einzelne Personen gilt.
  Frage bei eigenen Bildern nach den Assets und ihrer Zuordnung zu Personen-IDs.
  Für die Demo heißen diese IDs aktuell `acme-lena`, `acme-noah`, `acme-mila`;
  produktiv sind es die echten SIGNL4-Benutzer-IDs. Rate diese Zuordnung nicht.
- Lege lokale Bilder unter `public/avatars/` ab. Erstelle eine JSON-Zuordnung
  `avatars.json` und setze `CSP_AVATARS_PATH=avatars.json` in der öffentlichen
  Konfiguration. Das Schema ist eine Zuordnung von Benutzer-ID zu Bild-URL,
  beispielsweise `{ "acme-lena": "/csp-northwind/avatars/lena.png" }`.
- Berücksichtige `CSP_BASE_PATH` für alle lokalen Avatar-URLs. Wenn Root-Hosting
  und Pages-Unterpfad unterstützt werden, ergänze eine gemeinsame Auflösung
  für den jeweiligen Build/API-Kontext oder passende Konfigurationsdateien.
  Ein festes `/avatars/lena.png` funktioniert nicht automatisch unter Pages.
- Bestehende Provider-Bilder bleiben erhalten, sofern keine Overrides gewünscht
  sind. Initialen erscheinen als Fallback, wenn weder Override noch Provider-
  Avatar vorhanden ist. Das Entfernen eines Overrides deaktiviert einen
  vorhandenen Provider-Avatar nicht: Für ausdrücklich gewünschte Initialen
  passe die betreffende Demo-/Kundenintegration entsprechend an.
- Prüfe ID-Konsistenz, Bildausschnitt und Lesbarkeit auf Mobilgeräten. Lokale
  Assets sind auch ohne Provider erreichbar. Fehlende oder fehlerhafte Bilder
  dürfen nicht als erfolgreich umgesetzte Avatar-Anpassung gemeldet werden.

## 5. Inhalte, Beispiele und Demo konsistent machen

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

## 6. Ergebnis prüfen

1. Suche nach alten Markenreferenzen, ohne private dotenv-Dateien oder
   `node_modules` zu durchsuchen. Prüfe gezielt die oben genannten Quelldateien,
   Beispielkonfigurationen und `public/`. Unterscheide historische Template-
   Verweise von versehentlich übrig gebliebenen aktiven Markenwerten.
2. Prüfe den Diff: Markenname, technische Namen, Logo/Icon, Avatar-Zuordnungen, Hotline und
   Produktions-Overrides passen zusammen. Assetpfade existieren; Inhalte
   bleiben valide. Eine reine Markenänderung aktualisiert keine CSP-Abhängigkeiten.
3. Führe `pnpm install --frozen-lockfile` und `pnpm check` aus. Für einen
   Pages-Build setze zusätzlich `CSP_DEMO=true`,
   `VITE_CSP_STATIC_DEMO=true`, einen Repository-Unterpfad und eine API-Origin
   **derselben Frontend-Origin**, deren Pfad auf `/demo-api` endet; baue mit
   `pnpm exec vite build`.
4. Prüfe `dist/index.html`, `dist/manifest.webmanifest`, generierte Icons und
   kopiertes Logo: Titel, PWA-Name, Farben, Basispfad und Canonical-Link stimmen.
   Stelle sicher, dass Favicon und PWA-/Splash-Icons aus dem ausgewählten Logo
   erzeugt werden und dass alle referenzierten Avatarbilder existieren.
   Prüfe sowohl `/` als auch `/<repository-name>/`, wenn beide unterstützt werden.
5. Nutze für Builds mit abweichenden Konfigurationen einen temporären separaten
   Arbeitsstand mit den aktuellen Änderungen und ohne private dotenv-Dateien.
   Überschreibe oder entferne nicht die lokale Konfiguration des Nutzers.
6. Wenn eine Browserprüfung verfügbar ist, kontrolliere Desktop/Mobilansicht,
   Logo, Favicon, Avatare, Lesbarkeit, Navigation und den Demo-Modus. Wenn
   möglich, installiere die PWA auf der Zielplattform und prüfe den Splash Screen;
   andernfalls kennzeichne die tatsächliche Splash-Darstellung als ungeprüft. Prüfe die Pages-Demo ohne
   laufenden API-Service. Melde fehlende Browser- oder Deployment-Prüfungen klar.

Veröffentlichung, Remote-Änderungen und Repository-Einstellungen folgen dem
Auftrag des Nutzers und den geltenden Repository-Regeln. Nach Veröffentlichung
prüfe den Workflow, sofern Zugriff besteht. Behaupte keine erfolgreiche Änderung
an GitHub-Einstellungen oder kein Live-Deployment ohne entsprechende Bestätigung.

## Ergebnis mitteilen

Nenne die umgesetzte Marke, gewählte Farben/Assets und Avatar-Zuordnungen,
wesentliche Dateien, Prüfungen und noch offene echte
Betriebswerte. Beschreibe kurz, ob die Instanz als Demo oder produktiv konfiguriert
ist. Verlinke einen erstellten Commit/PR oder die verifizierte Veröffentlichung,
wenn dies Teil des Auftrags war.
