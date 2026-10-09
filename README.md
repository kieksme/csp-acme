# Acme Service Portal

Das Serviceportal für Acme bündelt Supportkontakte, Bereitschaften, Störungsmeldungen, Systemstatus und Hilfethemen.

- [Demo öffnen](https://kieksme.github.io/csp-acme/)
- [Dokumentation im CSP-Wiki](https://github.com/kieksme/csp/wiki)
- [Änderungen an CSP in der CHANGELOG](https://github.com/kieksme/csp/blob/main/CHANGELOG.md)

Die Demo verwendet erfundene Daten und Beispielkontakte. Kontakt-Downloads sind in der statischen Demo nicht verfügbar.

## Persönlicher Service-Header

Das Portal verwendet CSP 0.6.1. Der Header zeigt links die große persönliche Begrüßung und den Hinweis „Jetzt im Dienst · Für Sie zuständig“, rechts das freigestellte Porträt mit rundem unteren Ausschnitt und Kreisrahmen; der Kopf ragt darüber hinaus. Zusätzliche Überschriften „Serviceportal“ und „Acme Service Portal“ entfallen im Header. Unter dem Bild stehen Name und Dienststatus. Das Eingabefeld darunter gehört zum digitalen Assistenten. Persönlicher Kontakt ist über die Hotline möglich.

Ohne aktive Schicht nennt der Header den nächsten bekannten Beginn als heute, morgen, übermorgen oder Datum in der Schicht-Zeitzone. Sind die Schichtdaten nicht erreichbar oder veraltet, wird die Erreichbarkeit nicht bestätigt.

Avatar-Zuordnungen stehen in `avatars.json` und werden in beiden Konfigurationsprofilen geladen. Die statische Demo verwendet fünf synthetische Personen.

Das lokale Stylesheet `design-system/portal.css` korrigiert den Textkontrast aktiver Schichten, ohne die Acme-Markenfarben zu ändern. Der CLI-Patch für 0.6.1 lädt dieses Stylesheet und referenzierte Bilder im lokalen Entwicklungsserver.

Der CLI-Patch ergänzt außerdem das API-Dockerfile um die Patch-Dateien vor der Produktion-Installation. Dadurch kann die eingefrorene Lockdatei auch im API-Image unverändert verwendet werden.

Die Header-Anordnung wird bis zur nächsten gemeinsamen CSP-Veröffentlichung durch die eingecheckten Patches für `@kieksme/csp-core@0.6.1` (Styles) und `@kieksme/csp-plugin-signl4@0.6.1` (Header) bereitgestellt. Sie werden mit der Lockdatei installiert und gelten für Entwicklung, Demo- und Produktionsbuild. Bei einem Paketupdate auf einen Release mit dieser Anordnung müssen diese beiden Übergangspatches entfernt werden; der CLI-Patch bleibt separat bestehen.

## Lokal mit Ollama testen

`pnpm dev:ollama` startet den Chat mit echten Ollama-Antworten; Schichten, Kontakte und Systemstatus bleiben Demo-Daten. Hinterlege `CSP_CHAT_OLLAMA_URL` (z. B. `http://localhost:11434`) und ein installiertes `CSP_CHAT_MODEL` in der ignorierten `.env.local`. `CSP_CHAT_TIMEOUT_MS` gibt langsamen Modellen bis zu fünf Minuten Antwortzeit (Standard 60 Sekunden). `pnpm dev` verwendet weiterhin den Demo-Chat.

Der Übergangspatch für `@kieksme/csp-plugin-chat@0.6.1` ergänzt `CSP_CHAT_DEMO`, bis die nächste CSP-Version diese Einstellung enthält. Entferne ihn beim entsprechenden Paketupdate.

Im Chat sendet `⌘ + Enter` auf macOS bzw. `Strg + Enter` auf anderen Systemen die Nachricht. `Enter` allein fügt einen Zeilenumbruch ein. Ein dezenter Hinweis mit dem passenden Tastenkürzel steht unten rechts im Textfeld. Der Chat-Übergangspatch ergänzt auch dieses Tastenkürzel; der Core-Patch liefert die dazugehörigen Styles.

Das Chat-Feld startet einzeilig, wächst automatisch mit dem Text und schrumpft beim Kürzen oder Absenden wieder.

Beim Seitenaufruf ist das Chat-Textfeld automatisch fokussiert.

Das Chat-Feld hat einen dezenten Fokusrahmen in der sekundären Textfarbe des jeweiligen Designs.

Die FAQ-Kategorie-Chips haben großzügigere Abstände, klare Konturen und eigene Zustände für Auswahl, Hover und Tastaturfokus in beiden Designs.

Der Porträtkreis übernimmt die Acme-Markenfarbe halbtransparent. Design-Schalter und FAQ-Chips nutzen einheitliche, dezente Schatten mit einem stärkeren Hover-Zustand.

Das Acme-Logo passt seine Schriftfarbe an das aktive Farbschema an: dunkel im hellen Design, hell im dunklen Design. Das orange Bildzeichen bleibt erhalten.
