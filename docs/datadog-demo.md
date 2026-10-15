# Datadog-Demo

Die zusätzliche Demo wird unter [Acme mit Datadog](https://kieksme.github.io/csp-acme/datadog/) veröffentlicht. Sie zeigt Cases mit Filter und Pagination, Monitorstatus, SLOs über 30 Tage und Bereitschaften für sieben Tage. Das bestehende Supportportal unter `/csp-acme/` behält SIGNL4, Kuma und Slack.

Das separate Profil `portal.datadog-demo.json` enthält Kontakt, Datadog, Inhalte und Chat. Sämtliche Personen und Zustände sind synthetisch. Es braucht keine Zugangsdaten und sendet keine Datadog-Anfragen. Fiktive Datensätze haben keine Links zu echten Tickets. Der statische Chat liefert eine feste Datadog-Zusammenfassung mit Quellen.

## Lokal starten

Acme verwendet die regulär veröffentlichten CSP-Pakete ab 0.14.0. Ein separater Produkt-Checkout oder lokale Tarballs sind nicht mehr nötig.

```sh
pnpm install --frozen-lockfile
pnpm dev:datadog
```

Das Demo-Skript richtet beim ersten Start automatisch eine isolierte Instanz in `.csp/datadog-demo` mit den exakt in Acme deklarierten Paketversionen ein. Bei Versionswechseln aktualisiert es diese Instanz. `pnpm setup:datadog` kann die Installation jederzeit erneut ausführen. Inhalte, Bilder und Styles werden bei jedem Start/Build aus Acme übernommen.

Die Seite läuft unter `http://127.0.0.1:5173`, die optionale Demo-API auf Port `3038`. Der Browser-Transport funktioniert auch ohne API.

```sh
pnpm check:datadog
pnpm build:datadog-demo
```

Der statische Build steht unter `.csp/datadog-demo/dist`. `pnpm check` prüft auch das Datadog-Profil. In GitHub Actions baut der Check-Job zusätzlich mit dem öffentlichen Unterpfad `/csp-acme/datadog/`. Der Pages-Job kombiniert diesen Build mit dem bestehenden Supportportal und veröffentlicht beide zusammen. Provider-Schlüssel gelangen in keinen dieser Builds.

## Datadog-Account und spätere Live-Anbindung

Für die Acme-Einrichtung besteht seit dem 15. Oktober 2026 ein eigenständiges EU1-Testkonto. Der Browser-Login, die bestätigte Eigentümeradresse und der Admin-Zugriff auf die vom Eigentümer benannte Organisation „kieks.me GbR“ wurden geprüft. Das Konto gehört nicht zur bestehenden NULLzuEINS-Organisation. Datadog zeigte bei der Abnahme eine 14-tägige Testlaufzeit; ein kostenpflichtiges Upgrade wurde nicht durchgeführt.

Die echte Provider-Verbindung bleibt **noch ungetestet und deaktiviert**, bis Konto und Ressourcen eingerichtet sowie die lesenden API-Abfragen geprüft sind. API-/Application-Key und Projekt-, Monitor-, SLO- und Schedule-Auswahl werden ausschließlich am API-Host konfiguriert. [Einrichtung und erforderliche Rechte im CSP-Wiki](https://github.com/kieksme/csp/wiki/datadog).
