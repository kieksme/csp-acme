# Slack-Support in Acme

Acme ist eine offene Webseite. Besucher benötigen keinen Login und keinen Microsoft-Tenant. Das Profil `portal.support.json` verwendet `chatSupport.mode: "slack"` mit `auth: "anonymous"`. Das Backend vergibt automatisch eine signierte Besuchersitzung; jeder Besucher kann nur seine eigenen Chats lesen. Supportpersonen übernehmen und beantworten Gespräche im privaten Channel **acme-support** im Workspace **kieks.me GbR**.

```mermaid
flowchart LR
  Besucher[Offene Acme-Webseite] -->|Besuchersitzung und Nachrichten| API[Acme API auf nze-two]
  API <-->|Gespräch und Zustand| DB[(acme-support-db)]
  API -->|Ein Thread je Chat| Slack[Privater Slack-Channel acme-support]
  Support[Freigegebene Supportperson] -->|Übernehmen und antworten| Slack
  Slack -->|Signierte Aktionen und Events| API
  API -->|Antwort und Supportname| Besucher
```

## Besuchersitzungen

Sitzungen bleiben 24 Stunden im Browser-Tab erhalten, auch beim Neuladen. Nach Ablauf oder Schließen des Tabs sind alte Chats ohne Token nicht erreichbar. „Chat neu verbinden“ startet eine neue Sitzung. Die Besuchernamen sind pseudonym und nicht verifiziert. Gesprächsaufbewahrung standardmäßig 30 Tage; Slack-Kopien und Backups haben eigene Fristen. Die API begrenzt neue Sitzungen und Nachrichten; Supportrechte werden weiterhin über Slack-Nutzerliste und aktuelle Channel-Mitgliedschaft geprüft.

## Lokale Übernahme-Demo

```sh
pnpm install --frozen-lockfile
pnpm dev:support
```

Das Profil `portal.support-demo.json` verwendet fiktive Personen und Gespräche im Arbeitsspeicher. Lena Demo kann übernehmen, antworten, zurückgeben und abschließen. Es wird keine Slack-Anfrage gesendet. Die lokale Demo bestätigt keine echte Zustellung.

## Runtime und Veröffentlichung

`pnpm setup:slack` erzeugt das öffentliche Profil ohne Zugangsdaten; ein vorhandenes Profil wird nur mit `--force` überschrieben. Der gemeinsame Workflow baut Frontend und API mit `portal.support.json`. Alle CSP-Pakete verwenden dieselbe veröffentlichte Version.

Am API-Host die vorhandenen Provider-Werte beibehalten und `.env.slack.example` ergänzen: `CSP_CONFIG_PATH=portal.support.json`, `CSP_SLACK_ENABLED=true`, `CSP_SLACK_DEMO=false`, `CSP_SLACK_AUTH=anonymous`. Mit `openssl rand -hex 32` einmalig `CSP_CHAT_SESSION_SECRET` erzeugen. Schlüssel, PostgreSQL-Zugang, Bot-Token und Signing Secret ausschließlich als Runtime-Secrets speichern; keine Secrets in Profil, Git oder Frontend.

Die App **Support** ist installiert und dem privaten Channel hinzugefügt. Öffentliche Zuordnung: Workspace `T0C8FU76EBT`, Channel `C0C88MBSZV3`, App `A0C8DSXUQ3C`, berechtigter Supportnutzer André `U0C87P9DU83`. PostgreSQL **acme-support-db** läuft intern auf **nze-two** unter Coolify, ohne öffentlichen Datenbankport, mit 384 MiB Speicherlimit. Azure-Datenbank und Entra-Apps sind nicht erforderlich.

Events `/api/slack/events` sind verifiziert und mit `message.groups` sowie `message.channels` aktiviert; Interaktivität `/api/slack/actions` ist gespeichert. Genau ein API-Replikat pro Support-Datenbank betreiben und Rollouts ohne überlappende Supportprozesse durchführen. Anleitung und Scopes: [CSP-Slack-Dokumentation](https://github.com/kieksme/csp/wiki/slack-support).

## Live-Abnahme

**Live geprüft am 11.10.2026 mit CSP 0.10.1.** Die laufende API verwendet das Image `ghcr.io/kieksme/csp-acme-api:1a29e1bf1c1533f0ab98c4a4ea53da36aca6643f` auf nze-two.

| Prüfung                         | Beobachtetes Ergebnis                                                             |
| ------------------------------- | --------------------------------------------------------------------------------- |
| Offene Webseite                 | Besuchersitzung automatisch, ohne Microsoft-Login                                 |
| Weiterleitung                   | Besucherfrage und fertige KI-Antwort im echten Slack-Thread                       |
| Menschlicher Support            | André übernimmt per Button; seine Thread-Antwort erscheint im Portal              |
| Laufende KI-Antwort             | Übernahme stoppt die Generierung; Verlauf zeigt „Antwort unterbrochen“            |
| Gesprächssteuerung              | Besucherantwort, Rückgabe, erneute Übernahme und Abschluss funktionieren          |
| API-Neustart und Browser-Reload | Gleiche Besuchersitzung, Verlauf und aktive Supportübernahme bleiben erhalten     |
| Separate Besuchersitzung        | Chat fehlt in der Liste; Lesen, Schreiben und SSE liefern 404, ohne Identität 401 |

Der Test-Chat ist abgeschlossen. Der Neustart betrifft nur den einzelnen API-Container; PostgreSQL und VPS wurden nicht neu gestartet. `/health` bestätigt nur den API-Prozess. Synthetische Kontakte und Schichten bleiben synthetisch, auch wenn Slack und KI-Provider live sind.


## Problem gelöst und Klärungsfragen (CSP 0.11.0)

Besucher können ihren eigenen Chat mit **Problem gelöst** beenden, auch während einer KI-Antwort oder Support-Übernahme. Die Lösung wird gespeichert, unterbricht die KI-Ausgabe und aktualisiert Verlauf und Statuskarte in Slack. Berechtigter Support kann im Botmodus ebenfalls lösen; nach Übernahme darf das nur die zuständige Person. **Abschließen** bleibt ohne Behauptung einer Lösung verfügbar.

Bei unklaren Erstfragen wie „Hallo, meine Email“ soll der Assistent zunächst kurz nach dem konkreten Problem fragen. Ticketlinks folgen erst bei erforderlicher Eskalation oder ausdrücklichem Ticketwunsch. Das gemeinsame Headset-Avatar wurde in der vorhandenen Slack-App gespeichert. Die neuen Chat-Funktionen wurden am 12.10.2026 in Acme live abgenommen (Nachweise unten).


## Live-Abnahme CSP 0.11.0 am 12.10.2026

Die API läuft mit dem unveränderlichen Acme-Image `ghcr.io/kieksme/csp-acme-api:866183f80c8d1baaf63b266f9308d096980a75a8`. GitHub Pages, Image-Publishing und Coolify-Rollout waren erfolgreich; der Container ist gesund und das externe `/health` liefert 200. Die Besuchersitzungen und interne PostgreSQL-Datenbank bleiben erhalten.

| Prüfung | Tatsächlicher Nachweis |
| --- | --- |
| Unklare Erstfrage | Auf „Hallo, meine Email“ antwortete der echte KI-Provider: „Was funktioniert bei Ihrer E-Mail gerade nicht – das Senden, das Empfangen oder die Anmeldung?“ Kein Ticketlink in dieser Antwort. |
| Besucher löst | Portal wurde geschlossen; Systemmeldung „Der Besucher hat das Problem als gelöst markiert.“ und Slack-Status „Problem gelöst“. |
| Support löst ohne Übernahme | André Lademann klickte im Slack-Test-Thread auf „Problem gelöst“; das Portal zeigte den Lösungsstatus und die Support-Systemmeldung. |
| Laufende KI unterbrechen | Besucher klickte während einer neuen Antwort auf „Problem gelöst“; der Verlauf zeigte „(Antwort unterbrochen)“ und blieb gelöst. |
| Fremde Sitzung | Listen/Lesen/Schreiben/SSE sowie `POST /resolve` für den fremden Test-Chat wurden mit 404 abgewiesen. Ohne Identität lieferten Lesen und Lösen 401. |
| Avatar | Das neue Support-Headset-Avatar ist nach Slack-Neuladen im echten Channel sichtbar. |
| Neuladen | Besuchersitzung, unterbrochene Antwort und Lösungsstatus wurden nach Browser-Neuladen wiederhergestellt. |

Alle Tests verwendeten eine getrennte Besuchersitzung; vorhandene Nutzer-Gespräche wurden nicht übernommen oder geschlossen. Die bereits vorhandene offene Slack-Karte wurde zusätzlich mit dem Lösungs-Button aktualisiert, ohne den Chat zu übernehmen oder zu schließen. Neu angelegte Gespräche haben den Lösungs-Button sofort. Das alte „Abschließen“ bleibt von „Problem gelöst“ getrennt. Die frühere Abnahme vom 11.10.2026 ist ein historischer Nachweis für CSP 0.10.1.

## Chat-Verbesserungen mit CSP 0.12.0

Der Chat zeigt wieder **⌘ Enter zum Senden** beziehungsweise **Strg Enter zum Senden**. Lange Verläufe folgen neuen Antworten am Ende; beim Hochscrollen bleibt die Leseposition erhalten, **Neue Nachrichten ↓** führt zurück ans Ende. Das Eingabefeld bleibt außerhalb des scrollbaren Verlaufs.

**Nachricht diktieren** nimmt nach Mikrofonfreigabe maximal 60 Sekunden auf. Der vorhandene OpenAI-Schlüssel wird ausschließlich im Backend verwendet; `gpt-4o-mini-transcribe` erstellt einen bearbeitbaren Zusatz zum Entwurf. Der Benutzer sendet selbst. Audiodateien werden nicht in PostgreSQL gespeichert. Fehler erhalten den Entwurf.

**Ich möchte mit einer echten Person sprechen** pausiert die KI sofort, auch während einer Antwort oder vor der ersten Nachricht. Die gespeicherte Anfrage benachrichtigt **André als feste Vertretung** über seinen berechtigten Slack-Account; Acmes fiktive Dienstpersonen lösen keine gezielten Benachrichtigungen aus. Runtime-Zuordnung: `CSP_SUPPORT_FALLBACK_USER_IDS=U0C87P9DU83`. Ohne gültige Zuordnung bleibt die Anfrage im Support-Channel sichtbar. Das Portal unterscheidet Anfrage, verzögerte Zustellung und tatsächliche Übernahme. Weitere Besuchernachrichten im Wartezustand lösen keine KI-Antwort aus; nur der zuständige Support kann nach Übernahme antworten und den Bot ausdrücklich wieder freigeben.

Besuchernachrichten erscheinen in Slack als Zitat mit **Besucher · Name**; die KI bleibt als **Digitaler Assistent** bezeichnet. Diese Änderung betrifft neue weitergeleitete Nachrichten. Acme bleibt öffentlich ohne Microsoft-Login. Teams und Telegram werden durch dieses Update nicht installiert.

[Gemeinsamer Chat-Vertrag und API](https://github.com/kieksme/csp/wiki/chat).
