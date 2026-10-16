# Datadog-Testressourcen und Live-Profil

Stand: 16. Oktober 2026. Die Ressourcen liegen im eigenständigen EU1-Testkonto
der Organisation „kieks.me GbR“, das für die Acme-Einrichtung verwendet wird.

## Echte HTTP-Monitore

| Ressource | Prüfung | ID |
| --- | --- | --- |
| [Acme API – Health](https://app.datadoghq.eu/monitors/127595870) | `https://csp-acme.kieks.me/health`: HTTP 200, Antwort enthält `"status":"ok"`, Antwortzeit unter 5 Sekunden | `127595870` |
| [Acme Portal – Erreichbarkeit](https://app.datadoghq.eu/monitors/127596025) | `https://kieksme.github.io/csp-acme/`: HTTP 200, HTML enthält `Acme Service Portal`, Antwortzeit unter 5 Sekunden | `127596025` |

Beide Synthetic-HTTP-Tests laufen alle 15 Minuten aus Frankfurt (AWS), mit einem
Wiederholungsversuch nach einer Sekunde bei Fehlern. Tags: `project:acme`,
`env:demo` und der jeweilige Service `acme-api` bzw. `acme-portal`.
`env:demo` bezeichnet den Testzweck; die HTTP-Abfragen und ihr Status sind echt.
Bei der Monitor-Abnahme am 15. Oktober zeigten beide Monitore **OK**. Die Portal-Prüfung bestätigt den
HTTP-Einstiegspunkt und das gelieferte HTML; sie führt keine Browser-Interaktionen aus.

Test-IDs: API `hk8-wxs-hpm`, Portal `ium-wry-t5p`.

Das monitorbasierte SLO „Acme Web-Services – Verfügbarkeit (Test)“ fasst beide
Monitore zusammen: Ziel **99,9 % über 30 Tage**, ID
`e5ce1645100459fba2d1aa3f372ab630`. Messdaten liegen erst seit der Einrichtung vor.
Eine Anzeige von 100 % ist keine Bestätigung einer rückwirkenden 30-Tage-Verfügbarkeit.

## Bereitschaften und Testnutzer

Zwei Pläne sind in `Europe/Berlin` gespeichert:

| Plan | Zeitfenster | ID |
| --- | --- | --- |
| [Acme – Werktage (Test)](https://app.datadoghq.eu/on-call/schedules/ae0208c7-4a47-4884-9649-3341d3ea14a5) | Montag bis Freitag, 08–18 Uhr | `ae0208c7-4a47-4884-9649-3341d3ea14a5` |
| [Acme – Wochenende (Test)](https://app.datadoghq.eu/on-call/schedules/91767f1b-af0a-4e0d-8984-9220158856c9) | Samstag 00 Uhr bis Montag 00 Uhr | `91767f1b-af0a-4e0d-8984-9220158856c9` |

Die erfundenen Testpersonen heißen Dirk, Lena und Noah. Ihre drei Konten sind
seit der Abnahme am 16. Oktober **Active**, jeweils mit **Datadog Read Only Role**.
Die freigegebenen drei On-Call-Sitze wurden in der laufenden Testphase zugewiesen;
ein kostenpflichtiges Upgrade wurde nicht vorgenommen. Datadog zeigt derzeit
die E-Mail-Aliasse als Responder an; persönliche Anzeigenamen sind nicht gesetzt.
Die persönlichen Adressen werden nicht in dieser öffentlichen Anleitung veröffentlicht.

Die gespeicherten Rotationen verwenden folgende Reihenfolge:

- **Werktage:** Dirk → Lena → Noah, täglicher Wechsel im Zeitfenster 08–18 Uhr.
- **Wochenende:** Lena → Noah → Dirk, wöchentlicher Wechsel am Samstag um
  00 Uhr. Eine Person übernimmt jeweils das gesamte Wochenende.

Der Eigentümer ist aus den zukünftigen Rotationen entfernt. Im Wochenendplan
wurden Lena für den 17.–18. Oktober und Noah für den 24.–25. Oktober anhand der
gespeicherten Kalenderansicht geprüft. Es wurden keine Test-Pages versandt und
keine Eskalationsbenachrichtigungen konfiguriert. Die Pläne allein bestätigen
keine Zustellung von Alarmen.

## Portal-Anbindung vorbereiten

Das Work-Management-Projekt **Acme Test**, Schlüssel `ACME`, ist angelegt.
Seine Case-Projekt-ID lautet `dbca84fb-e14c-4936-b6ed-4987cf61f60d`.
Die Datadog-Oberfläche bezeichnet Case Management inzwischen als Work Management.
Das Beispielticket `ACME-1` („Acme API – Health-Check im Portal abnehmen“) ist offen
und wurde über die Cases-API mit und ohne OPEN-Filter erfolgreich gelesen.
Das Beispielticket `ACME-2` („Acme Portal – HTTP-Erreichbarkeit geprüft“) ist geschlossen.
Die Beispiele sind unzugewiesen und lösen keine Alarmierung aus.

`portal.datadog-live.json` ist ein separates Profil für echte Datadog-Abfragen.
Es verwendet die veröffentlichten CSP-Pakete 0.14.1 und lädt Kontakt, Datadog und
Hilfethemen. Die lokale API ist auf Port 3039 vorgesehen. Die Datei
`.env.datadog.example` enthält ausschließlich Konfigurationsnamen und die
ausgewählten Ressourcen-IDs, keine Schlüssel.

In einer eigenen Instanz die Werte aus der Vorlage als ignorierte `.env.local`
hinterlegen. API- und Application-Key müssen serverseitig verfügbar sein.
Der Application-Key benötigt `cases_read`, `monitors_read`, `slos_read` und
`on_call_read`. Alle vier Ressourcen-Auswahlen sind in der Vorlage eingetragen;
die API-Lesbarkeit wurde lokal mit Version 0.14.1 geprüft.
Mit den leeren Schlüsselwerten der öffentlichen Vorlage startet das Live-Profil absichtlich nicht. Für die lokale Leseabnahme wurden nach Freigabe ein eigener API-Key und ein Application-Key mit genau diesen vier Leserechten erstellt und ausschließlich in einer ignorierten Datei mit Dateimodus 0600 hinterlegt. Actions-Zugriff bleibt deaktiviert.

`pnpm check:datadog-live` validiert und baut das zusätzliche Profil; der Aufruf
ist auch Teil von `pnpm check`. Diese Build-Prüfung benötigt keine Provider-Schlüssel
und ist keine Abnahme einer echten API-Verbindung.

Nach vollständiger Einrichtung:

```sh
pnpm exec csp validate --config portal.datadog-live.json
pnpm exec csp dev --config portal.datadog-live.json
```

Für eine Veröffentlichung eine eigene API-Runtime mit HTTPS und dem Live-Profil
bereitstellen. Die öffentlichen Werte `CSP_API_URL`, `CSP_DOMAIN`, `CSP_BASE_PATH`
und die erlaubten Browser-Origins an dieses Ziel anpassen. Nur die ausdrücklich
ausgewählten Testdaten veröffentlichen. Der bestehende Support-API-Prozess nutzt
weiterhin sein eigenes Profil.

**Live-Abnahme und Veröffentlichung:** Am 16. Oktober wurde die
korrigierte Plugin-Version aus [dem Produkt-Fix](https://github.com/kieksme/csp/pull/68)
gegen Datadog EU1 und im lokalen Browser geprüft: zwei Monitore OK, ein SLO mit
verfügbaren Messwerten, sieben Schichten, Team-Ableitung und das leere Case-Projekt.
Der Produkt-Fix ist mit Version 0.14.1 veröffentlicht und im Kundenprofil übernommen.
Die öffentliche Seite unter `/csp-acme/datadog/` bleibt eine synthetische Demo.
Die beiden Beispieltickets und die Filter OPEN, CLOSED und IN_PROGRESS wurden lokal live geprüft. Alarmzustellung ist nicht eingerichtet oder abgenommen.
Die fünf Datadog-Routen und ihre Browserdarstellung sind auch auf der endgültigen HTTPS-Runtime geprüft (siehe unten). Niemals Provider-Schlüssel an den
Browser oder GitHub Pages ausliefern.

[Datadog-Demo](datadog-demo.md) ·
[Provider-Konfiguration](https://github.com/kieksme/csp/blob/main/docs/datadog.md)

## Getrennte HTTPS-Runtime

Das zusätzliche veröffentlichte Testprofil `portal.datadog-hosted.json` verbindet
`https://kieksme.github.io/csp-acme/datadog-live/` mit
`https://csp-acme.kieks.me/datadog-api`. Die synthetische Demo bleibt unter
`/csp-acme/datadog/` verfügbar. Die Pipeline baut beide Datadog-Frontends und das
separate private Image `ghcr.io/kieksme/csp-acme-datadog-api`; die Images werden
mit unveränderlichem Kundencommit getaggt.

Die Coolify-Anwendung `kieks.me.csp-acme-datadog` hat die UUID
`fvueroncudpbfmmdq1moxwzm` und verwendet `CSP_DEMO=false`, Port 3001,
Browser-Origin `https://kieksme.github.io` und ausschließlich die oben ausgewählten
Datadog-Ressourcen. Coolify entfernt `/datadog-api` beim Weiterleiten. Der
Healthcheck ruft intern `/health` auf; extern lautet er `/datadog-api/health`.
Schlüssel sind Runtime-Variablen und werden nicht in das Image eingebaut.
Das veröffentlichte Testprofil lädt nur das Datadog-Plugin. Es zeigt keine
Beispiel-Hotline oder allgemeinen Hilfe-Links; eine echte Support-Hotline ist für
diese Testseite nicht konfiguriert. Der Build verwendet deshalb keine fachliche
Produktionsfreigabe (`--production`), die eine echte Hotline voraussetzt.

Am 16. Oktober ist die Anwendung ausgerollt und extern abgenommen:

- Laufender Commit-Tag: `26bb80f147bb9b4f7568d8ca374c8de3693caa3d`.
- Laufender Image-Digest: `sha256:71c0497e6946442247449c8d79c044f4e821e51ea1e88e4d5eea83fed154c058`.
- Im Container geprüft: Core und Datadog-Plugin jeweils **0.14.1**, Docker-Health **healthy**.
- Deployment: `7d723d71-f865-4a9f-a8d8-3a9ec8ffbb98`, Coolify-Status **finished**.
- [Veröffentlichungsworkflow](https://github.com/kieksme/csp-acme/actions/runs/38908835975): erfolgreich, inklusive beider Images und GitHub Pages.
- Externes `/datadog-api/health`: `status: ok`, ausschließlich Plugin `datadog` registriert.
- Alle fünf öffentlichen Datadog-Routen lieferten aktuelle Daten (`stale: false`) ohne Providerfehler: zwei Monitore OK, ein SLO, die Schichten im nächsten Sieben-Tage-Fenster, drei Dienstpersonen und beide Tickets.
- [Öffentliche Liveseite](https://kieksme.github.io/csp-acme/datadog-live/) im Browser geprüft: Monitorstatus OK, SLO-Messwert 100 %, kommende Wochenend-/Werktagsschichten, offenes und geschlossenes Ticket. Außerhalb der definierten Zeiten zeigt sie korrekt keine aktive Schicht an.
- Der bestehende Supportdienst unter `/health` blieb erreichbar und meldete seine bisherigen sechs Plugins. Er wurde für diesen Rollout nicht neu gestartet.
- Der lokale Frontend-Scan fand keinen der beiden Datadog-Schlüssel in den gebauten Dateien.

Die Anzahl sichtbarer Schichten verändert sich mit dem gleitenden Zeitfenster.
Die öffentlichen Namen bleiben bei fehlendem Datadog-Anzeigenamen Benutzer-IDs;
E-Mail-Aliasse werden nicht veröffentlicht. Alarmzustellung ist weiterhin nicht eingerichtet.

