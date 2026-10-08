# Acme Service Portal

Das Serviceportal für Acme bündelt Supportkontakte, Bereitschaften, Störungsmeldungen, Systemstatus und Hilfethemen.

- [Demo öffnen](https://kieksme.github.io/csp-acme/)
- [Dokumentation im CSP-Wiki](https://github.com/kieksme/csp/wiki)
- [Änderungen an CSP in der CHANGELOG](https://github.com/kieksme/csp/blob/main/CHANGELOG.md)

Die Demo verwendet erfundene Daten und Beispielkontakte. Kontakt-Downloads sind in der statischen Demo nicht verfügbar.

## Persönlicher Service-Header

Das Portal verwendet CSP 0.6.0. Der Header zeigt die bestätigte Schichtperson mit Bild, Begrüßung und dem Hinweis „Jetzt im Dienst · Für Sie zuständig“. Das Eingabefeld darunter gehört zum digitalen Assistenten. Persönlicher Kontakt ist über die Hotline möglich.

Ohne aktive Schicht nennt der Header den nächsten bekannten Beginn als heute, morgen, übermorgen oder Datum in der Schicht-Zeitzone. Sind die Schichtdaten nicht erreichbar oder veraltet, wird die Erreichbarkeit nicht bestätigt.

Avatar-Zuordnungen stehen in `avatars.json` und werden in beiden Konfigurationsprofilen geladen. Die statische Demo verwendet fünf synthetische Personen.

Das lokale Stylesheet `design-system/portal.css` korrigiert den Textkontrast aktiver Schichten, ohne die Acme-Markenfarben zu ändern. Der CLI-Patch für 0.6.0 lädt dieses Stylesheet und referenzierte Bilder im lokalen Entwicklungsserver.

Der CLI-Patch ergänzt außerdem das API-Dockerfile um die Patch-Dateien vor der Produktion-Installation. Dadurch kann die eingefrorene Lockdatei auch im API-Image unverändert verwendet werden.
