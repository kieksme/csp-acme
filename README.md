# Acme Service Portal

Das Serviceportal für Acme bündelt Supportkontakte, Bereitschaften, Störungsmeldungen, Systemstatus und Hilfethemen.

- [Demo öffnen](https://kieksme.github.io/csp-acme/)
- [Dokumentation im CSP-Wiki](https://github.com/kieksme/csp/wiki)
- [Änderungen an CSP in der CHANGELOG](https://github.com/kieksme/csp/blob/main/CHANGELOG.md)

Die Demo verwendet erfundene Daten und Beispielkontakte. Kontakt-Downloads sind in der statischen Demo nicht verfügbar.

## Persönlicher Service-Header

Das Portal verwendet CSP 0.15.0. Der Header zeigt links die große persönliche Begrüßung und den Hinweis „Jetzt im Dienst · Für Sie zuständig“, rechts das freigestellte Porträt mit rundem unteren Ausschnitt und Kreisrahmen; der Kopf ragt darüber hinaus. Zusätzliche Überschriften „Serviceportal“ und „Acme Service Portal“ entfallen im Header. Unter dem Bild stehen Name und Dienststatus. Das Eingabefeld darunter gehört zum digitalen Assistenten. Persönlicher Kontakt ist über die Hotline möglich.

Ohne aktive Schicht nennt der Header den nächsten bekannten Beginn als heute, morgen, übermorgen oder Datum in der Schicht-Zeitzone. Sind die Schichtdaten nicht erreichbar oder veraltet, wird die Erreichbarkeit nicht bestätigt.

Avatar-Zuordnungen stehen in `avatars.json` und werden in beiden Konfigurationsprofilen geladen. Die statische Demo verwendet fünf synthetische Personen.

Das lokale Stylesheet `design-system/portal.css` korrigiert den Textkontrast aktiver Schichten, ohne die Acme-Markenfarben zu ändern.

## Lokal mit Ollama testen

`pnpm dev:ollama` startet den Chat mit echten Ollama-Antworten; Schichten, Kontakte und Systemstatus bleiben Demo-Daten. Hinterlege `CSP_CHAT_OLLAMA_URL` (z. B. `http://localhost:11434`) und ein installiertes `CSP_CHAT_MODEL` in der ignorierten `.env.local`. `CSP_CHAT_TIMEOUT_MS` gibt langsamen Modellen bis zu fünf Minuten Antwortzeit (Standard 60 Sekunden). `pnpm dev` verwendet weiterhin den Demo-Chat.

Im Chat sendet `⌘ + Enter` auf macOS bzw. `Strg + Enter` auf anderen Systemen die Nachricht. `Enter` allein fügt einen Zeilenumbruch ein. Ein dezenter Hinweis mit dem passenden Tastenkürzel steht im Textfeld unten rechts.

Das Chat-Feld startet einzeilig, wächst automatisch mit dem Text und schrumpft beim Kürzen oder Absenden wieder.

Beim Seitenaufruf ist das Chat-Textfeld automatisch fokussiert.

Das Chat-Feld hat einen dezenten Fokusrahmen in der sekundären Textfarbe des jeweiligen Designs.

Die FAQ-Kategorie-Chips haben großzügigere Abstände, klare Konturen und eigene Zustände für Auswahl, Hover und Tastaturfokus in beiden Designs.

Der Porträtkreis übernimmt die Acme-Markenfarbe halbtransparent. Design-Schalter und FAQ-Chips nutzen einheitliche, dezente Schatten mit einem stärkeren Hover-Zustand.

Das Acme-Logo passt seine Schriftfarbe an das aktive Farbschema an: dunkel im hellen Design, hell im dunklen Design. Das orange Bildzeichen bleibt erhalten.

Favicon und PWA-Icons verwenden das einzelne orange Acme-Bildzeichen ohne Schriftzug aus `public/acme-icon.svg`. Das daraus erzeugte Favicon steht auch im lokalen Entwicklungsserver bereit. Produktions- und Demo-Builds erzeugen die Icons automatisch aus dem SVG.

Das dunkle Acme-Design verwendet neutrale Anthrazit-Flächen für Hintergrund und Karten, abgestimmte Rahmen und helle Texte. Orange bleibt die Marken-Akzentfarbe.

Die Hintergrundgrafik `public/acme-header-waves.svg` legt feine geschwungene Linien in Acme-Orange über die gesamte Header-Fläche. Sie ist transparent und über `--hero-background-image` in `design-system/portal.css` austauschbar. Lokale Bilder werden auch im statischen Demo-Build eingebunden.

Chat-Antworten tragen den Namen der aktuellen Bereitschaftsperson und die Kennzeichnung „Digitaler Assistent“. Ohne bestätigte Bereitschaft antwortet das Service-Team. Dienststatus wird nur für passende Monitore bestätigt; Support-Tickets sind direkt in der Antwort verlinkt. Die E-Mail-Demo enthält weiterhin keinen eigenen E-Mail-Monitor und bestätigt deshalb keine E-Mail-Verfügbarkeit.

## Hosted OpenAI-Chat

Das veröffentlichte Frontend verwendet `portal.support.json` für die separate Coolify-API; `portal.hosted.json` bleibt das Profil für reinen KI-Chat.
[Konfiguration, Image und Betriebsgrenzen](docs/deployment.md).

## Slack-Support

Das separate Slack-Plugin ist installiert. `pnpm dev:support` startet die lokale Übernahme-Demo ohne Slack-Zugriff. Acme bleibt eine offene Webseite ohne Login. Besucher erhalten automatisch eine eigene Chat-Sitzung. Die App „Support“ ist im privaten Slack-Channel „acme-support“ installiert; die Weiterleitung, Übernahme und Supportantwort wurden am 11.10.2026 live geprüft. [Acme-Einrichtung und Abnahme](docs/slack-support.md).

## Chat und persönliche Unterstützung

Der Service-Chat zeigt Status und Absender deutlich: eigene Nachrichten rechts, Antworten von Assistent und Support links. Eingabe, Senden, Tastenkürzel und Diktieren bilden einen gemeinsamen Bereich. Die Darstellung übernimmt Acmes Farben, unterstützt das dunkle Design und bleibt auf dem Handy bedienbar. Der Verlauf lässt sich auch per Tastatur scrollen.

Lange Chats scrollen bei neuen Antworten mit, solange Sie am Ende lesen. Beim Hochscrollen bleibt die Leseposition erhalten; **Neue Nachrichten ↓** führt zurück ans Ende. Die Eingabe ist kompakt: Das **Mikrofon-Symbol** sitzt direkt neben **Senden** in einer Zeile, und beide Buttons sind gleich hoch (44 px). Der Tastaturhinweis steht im Textfeld unten rechts und überdeckt keinen Entwurf. Auch Aufnahme stoppen und Abbrechen bleiben als beschriftete Symbole in derselben Buttonzeile. Darüber ergänzt die OpenAI-Spracheingabe einen bearbeitbaren Entwurf, der erst durch Sie gesendet wird.

**Ich möchte mit einer echten Person sprechen** pausiert die KI und fragt den Support an. Acme benachrichtigt André als feste Vertretung in Slack; die Dienstpersonen im Demo-Header sind fiktiv. Besuchernachrichten werden in Slack als Zitat gekennzeichnet. KI-Antworten im Channel beginnen kompakt mit **🤖**; echte Support-Antworten tragen den Namen. Im Portal bleibt „Digitaler Assistent“ sichtbar. [Einrichtung und Abnahme](docs/slack-support.md).

## Datadog-Demo

`pnpm dev:datadog` startet ein separates Profil mit Datadog Cases, Monitoren, SLOs und Bereitschaften. Es nutzt nur Beispieldaten. Die [öffentliche Datadog-Demo](https://kieksme.github.io/csp-acme/datadog/) verwendet CSP 0.15.0. [Setup, Build und Grenzen](docs/datadog-demo.md).

Im EU1-Testkonto überwachen zwei echte HTTP-Monitore die Acme-API und das Portal.
[Ressourcen-IDs, Bereitschaftsstatus und Live-Abnahme](docs/datadog-live.md).

Die [Datadog-Liveseite](https://kieksme.github.io/csp-acme/datadog-live/) zeigt echte Health-Status, Bereitschaften und die beiden Beispieltickets. Sie verwendet CSP 0.15.0 und eine eigene API-Runtime; [Einrichtung und Abnahme](docs/datadog-live.md). Die veröffentlichte synthetische Demo bleibt als
separates Beispiel erhalten.

Anonyme Nutzungsanalyse über [Swetrix](docs/analytics.md): Events und Support-Funnels für alle öffentlichen Acme-Varianten; lokal deaktiviert, DNT wird respektiert.
