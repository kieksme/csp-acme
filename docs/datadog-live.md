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

Der Plan „Acme – Werktage (Test)“ ist für Montag bis Freitag, 08–18 Uhr,
in `Europe/Berlin` vorbereitet. Vorläufig ist der vorhandene Eigentümer ausgewählt.
**Der Plan ist noch nicht gespeichert:** Datadog verlangt beim Anlegen die
Zuweisung eines On-Call-Sitzes; die Bestätigung steht noch aus.

Für zusätzliche Testnutzer fehlen erreichbare, vom Eigentümer benannte Adressen.
Noch keine Einladungen versandt und keine zusätzlichen Nutzerrechte vergeben.
Nach Annahme der Einladungen können die Nutzer rotierend in den Werktagsplan
und einen getrennten Wochenendplan aufgenommen werden.

## Portal-Anbindung vorbereiten

`portal.datadog-live.json` ist ein separates Profil für echte Datadog-Abfragen.
Es verwendet die veröffentlichten CSP-Pakete 0.14.0 und lädt Kontakt, Datadog und
Hilfethemen. Die lokale API ist auf Port 3039 vorgesehen. Die Datei
`.env.datadog.example` enthält ausschließlich Konfigurationsnamen und die
ausgewählten Ressourcen-IDs, keine Schlüssel.

In einer eigenen Instanz die Werte aus der Vorlage als ignorierte `.env.local`
hinterlegen. API- und Application-Key müssen serverseitig verfügbar sein.
Der Application-Key benötigt `cases_read`, `monitors_read`, `slos_read` und
`on_call_read`. Außerdem fehlen noch die echte Case-Projekt-ID und gespeicherte
Schedule-IDs; CSP 0.14.0 verlangt alle vier Ressourcen-Auswahlen außerhalb der Demo.
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
