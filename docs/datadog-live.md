# Datadog-Testressourcen und Live-Profil

Stand: 15. Oktober 2026. Die Ressourcen liegen im eigenständigen EU1-Testkonto
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
Bei der Abnahme zeigten beide Monitore **OK**. Die Portal-Prüfung bestätigt den
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

Vorläufig ist in beiden Plänen der vorhandene Eigentümer eingetragen. Sein
On-Call-Sitz wurde nach ausdrücklicher Freigabe für die laufende Testphase
zugewiesen; ein kostenpflichtiges Upgrade wurde nicht vorgenommen.

Die erfundenen Testpersonen heißen Dirk, Lena und Noah. Nach Freigabe wurden
drei Einladungen an die vom Eigentümer gewünschten Plus-Adressen desselben
Postfachs versandt, jeweils mit **Datadog Read Only Role**. Bei der Abnahme
zeigten alle drei Konten **Invite Pending**. Die persönlichen Adressen werden
nicht in dieser öffentlichen Anleitung veröffentlicht.

**Rotation noch offen:** Solange die Einladungen nicht angenommen sind, bietet
die Datadog-Nutzerauswahl die Testkonten nicht als Responder an. Nach Aktivierung
die Anzeigenamen setzen, die drei Testpersonen in die tägliche Rotation aufnehmen
und die dafür erforderlichen Trial-Sitze prüfen. Die Einladungen allein bestätigen
noch keine nutzbare Bereitschaft der Testpersonen. Es wurden keine Test-Pages
versandt und keine Eskalationsbenachrichtigungen konfiguriert.

## Portal-Anbindung vorbereiten

Das leere Work-Management-Projekt **Acme Test**, Schlüssel `ACME`, ist angelegt.
Seine Case-Projekt-ID lautet `dbca84fb-e14c-4936-b6ed-4987cf61f60d`.
Die Datadog-Oberfläche bezeichnet Case Management inzwischen als Work Management.
Die tatsächliche Lesbarkeit über die Cases-API muss bei der Live-Abnahme geprüft werden.

`portal.datadog-live.json` ist ein separates Profil für echte Datadog-Abfragen.
Es verwendet die veröffentlichten CSP-Pakete 0.14.0 und lädt Kontakt, Datadog und
Hilfethemen. Die lokale API ist auf Port 3039 vorgesehen. Die Datei
`.env.datadog.example` enthält ausschließlich Konfigurationsnamen und die
ausgewählten Ressourcen-IDs, keine Schlüssel.

In einer eigenen Instanz die Werte aus der Vorlage als ignorierte `.env.local`
hinterlegen. API- und Application-Key müssen serverseitig verfügbar sein.
Der Application-Key benötigt `cases_read`, `monitors_read`, `slos_read` und
`on_call_read`. Alle vier Ressourcen-Auswahlen sind in der Vorlage eingetragen;
die tatsächliche API-Lesbarkeit muss noch geprüft werden.
Mit den noch leeren Werten startet das Live-Profil absichtlich nicht.

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

**Noch nicht live angebunden:** Die öffentliche Seite unter `/csp-acme/datadog/`
bleibt eine synthetische Demo. Es wurden keine Datadog-Schlüssel erstellt und
keine API-Verbindung als erfolgreich geprüft. Vor der Umschaltung die fünf
Datadog-Routen für Cases, Monitore, SLOs, Schichten und Team sowie die Darstellung
im Browser mit echten Antworten abnehmen. Niemals Provider-Schlüssel an den
Browser oder GitHub Pages ausliefern.

[Datadog-Demo](datadog-demo.md) ·
[Provider-Konfiguration](https://github.com/kieksme/csp/blob/main/docs/datadog.md)
