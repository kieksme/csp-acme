# Slack-Support in Acme

Acme installiert `@kieksme/csp-plugin-slack` mit derselben CSP-Version wie Core, SDK und die übrigen Plugins. Der Live-Channel ist **noch nicht eingerichtet oder getestet**. Die bestehenden Hosted- und statischen Profile registrieren das Paket, aktivieren aber keine Slack-Übertragung. Das verhindert einen Start mit fehlenden Zugangsdaten.

## Lokale Übernahme-Demo

```sh
pnpm install --frozen-lockfile
pnpm dev:support
```

Das Profil `portal.support-demo.json` verwendet fiktive Personen und speichert Gespräche nur im Arbeitsspeicher. Der Chat bietet Übernahme durch Lena Demo, Antwort, Rückgabe und Abschluss. Es wird keine Slack-Anfrage gesendet. `pnpm build:support-demo` baut dieses Profil; `pnpm check` validiert und baut es zusätzlich zu den bisherigen Profilen.

## Echte Slack-Anbindung vorbereiten

1. Im Ziel-Workspace die App **Support** aus `node_modules/@kieksme/csp-plugin-slack/slack-app/manifest.example.json` anlegen. HTTPS-URLs auf die Acme-API setzen: Events `/api/slack/events`, Interaktivität `/api/slack/actions`. Bot in den dedizierten internen Support-Channel einladen. Anleitung, Scopes und Reihenfolge der URL-Verifizierung: [CSP-Slack-Dokumentation](https://github.com/kieksme/csp/wiki/slack-support).
2. Für das Portal Entra-API und SPA-App mit delegiertem `Chat.Access` konfigurieren. Die SPA-Redirect-URI muss `https://kieksme.github.io/csp-acme/` beziehungsweise die tatsächlich verwendete Portal-Adresse enthalten. Slack-Supportrechte sind eine separate Nutzerliste mit aktueller Channel-Mitgliedschaft.
3. Aus den **öffentlichen** Entra-IDs das Live-Profil erzeugen:

```sh
pnpm setup:slack --tenant-id <Tenant-GUID> --portal-client-id <SPA-App-GUID> --api-audience <API-App-GUID>
```

Das schreibt `portal.support.json` mit `chatSupport.mode: "slack"` und übernimmt Acme-Branding, Assets, API-Adresse und Provider-Demo aus `portal.hosted.json`. Ein vorhandenes Profil wird nur mit `--force` überschrieben; ein abweichender delegierter Scope kann mit `--scope-name` angegeben werden. Es werden keine Tokens erzeugt oder gespeichert. Dieses Profil darf mit den öffentlichen IDs eingecheckt werden, damit das API-Image dieselbe Datei enthält.

4. Am API-Host die bestehenden Werte aus `.env.hosted.example` beibehalten und die Werte aus `.env.slack.example` ergänzen. `CSP_CONFIG_PATH=portal.support.json` setzen. Pflicht: eigene PostgreSQL-Datenbank, Slack Bot-Token und Signing Secret, App-/Workspace-/Channel-ID, erlaubte Support-Nutzer-IDs und passende Entra-Werte. `CSP_SLACK_ENABLED=true`, `CSP_SLACK_DEMO=false`; `CSP_CHAT_DEMO=false` verwendet weiterhin den realen KI-Provider. Tokens und Datenbankzugang gehören ausschließlich in Runtime-Secrets.
5. `pnpm build:support` prüfen und die Konfiguration des gemeinsamen Workflows in `.github/workflows/deploy.yml` von `portal.hosted.json` auf `portal.support.json` umstellen. Frontend und API mit demselben Profil veröffentlichen, anschließend das passende API-Image in Coolify ausrollen. Die Runtime allein zu ändern reicht nicht: Der Browser muss den Supportmodus ebenfalls enthalten.

Genau ein API-Replikat pro eigener Support-Datenbank betreiben. Aufbewahrung standardmäßig 30 Tage ohne Gesprächsaktivität; Slack-Kopien und Backups haben eine eigene Frist. Die synthetischen Schichten und Kontakte bleiben synthetisch, auch wenn Login, Slack und KI-Provider live sind.

## Live-Abnahme

Echten Login, Channel-Thread, Nutzerfrage und abgeschlossene KI-Antwort prüfen. Übernahme während KI-Streaming muss den Bot stoppen und den aus Slack geprüften Supportnamen im Portal zeigen. Nur neue Textantworten der zuständigen Person dürfen ins Portal gelangen. Antworten anderer Personen bleiben intern. Rückgabe, erneute Übernahme, Abschluss, fehlende Berechtigung und Neustart im Supportmodus separat prüfen. `/health` bestätigt nur den API-Prozess.

Ein Live-Rollout ist erst mit festgelegtem Workspace/Channel, Supportpersonen und bereitgestellten Entra-/Slack-/PostgreSQL-Werten möglich. Die lokale Demo bestätigt keine echte Slack-Zustellung.
