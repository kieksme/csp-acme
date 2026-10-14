# Datadog-Demo

Das separate Profil `portal.datadog-demo.json` zeigt Datadog Cases, Monitorstatus, SLOs über 30 Tage und Bereitschaften für sieben Tage. SIGNL4, Kuma und Slack sind in diesem Profil nicht aktiv. Acmes bestehende Profile behalten ihre Anbieter.

Die Demo verwendet ausschließlich synthetische Daten. Sie braucht keine Zugangsdaten und sendet keine Datadog-Anfragen. Tickets und Schichten sind lesend; fiktive Datensätze haben keine echten Datadog-Links. Der Chat zeigt eine feste Datadog-Zusammenfassung mit Quellen.

## Lokal starten

Das neue Plugin benötigt auch den aktualisierten CSP-Core und SDK. Solange diese Änderungen noch nicht veröffentlicht sind, installiert das Setup lokal gepackte Pakete in der ignorierten `.csp/datadog-demo`-Instanz. Acmes normale Abhängigkeiten und Lockfile werden dabei nicht verändert.

```sh
# Einmalig mit dem CSP-Checkout, der packages/plugin-datadog enthält:
pnpm setup:datadog --source /pfad/zum/csp-worktree
pnpm dev:datadog
```

Die Seite öffnet sich unter `http://127.0.0.1:5173`; der Demo-API-Port ist `3038`. Die Daten funktionieren über den statischen Browser-Transport auch ohne API.

Alternativ `CSP_DATADOG_SOURCE` setzen. Ohne explizite Quelle verwendet das Setup den zuletzt gespeicherten lokalen Pfad oder das benachbarte `../csp`. Nach Änderungen im Produktrepo `setup:datadog` erneut ausführen. Ein frischer Checkout benötigt zuerst die Abhängigkeiten des CSP-Produktrepos (`pnpm install`).

```sh
pnpm check:datadog
pnpm build:datadog-demo
```

Der statische Build steht unter `.csp/datadog-demo/dist`. Er wird durch die bestehenden Deployments nicht automatisch veröffentlicht. Inhalte, Bilder und Styles werden vor jedem Start/Build aus Acme übernommen.

## Spätere Live-Anbindung

Noch ungetestet und in dieser Demo deaktiviert. Nach Veröffentlichung der CSP-Pakete kann das Plugin regulär installiert werden. Projekt-, Monitor-, SLO- und Schedule-Auswahl sowie Datadog-Leseschlüssel werden ausschließlich am API-Host konfiguriert. [Produktanleitung](https://github.com/kieksme/csp/blob/main/docs/datadog.md).
