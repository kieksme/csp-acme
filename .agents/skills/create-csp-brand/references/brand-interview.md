# Interaktiver Markenbrief

Erfrage fehlende Gestaltungsentscheidungen vor deren Umsetzung. Fülle bekannte
Werte bereits aus und stelle dafür keine erneuten Fragen. Fragen können in zwei
kurzen Runden gestellt werden; Antworten dürfen als Text oder Auswahl erfolgen.

## Runde 1: Marke und Farben

- Wie heißen Marke und Portal? Welcher technische Paket-/Repository-Name ist gewünscht?
- Welche Akzent- und Hintergrundfarbe sollen verwendet werden? Akzeptiere Hex-Werte,
  vorhandene Markenrichtlinien oder den Wunsch nach einem Farbvorschlag.
- Soll der Hintergrund auch für den installierten PWA-Splash Screen verwendet werden?

Bei gewünschten Vorschlägen zeige wenige konkrete Farbkombinationen samt Hex-Werten
und frage nach der Auswahl, sofern der Nutzer nicht freie Gestaltung erlaubt hat.

## Runde 2: Logos und Avatare

- Welches Logo soll verwendet werden? Bitte bei Bedarf im Chat um SVG/PNG-Dateien
  oder einen bereits vorhandenen Repository-Pfad. Unterstützt das Frage-Tool
  nur Text, fordere Datei-Uploads außerhalb dieses Tools an.
- Gibt es eine kompakte Bildmarke für Favicon und Splash-/PWA-Icons? Soll diese
  oder das vollständige Logo verwendet werden? Nutze dieselbe Marke als Quelle
  für Portal, Favicon und Splash Screen; das Seitenverhältnis darf nicht verzerrt werden.
- Sollen Avatare aus dem Provider kommen, durch eigene Bilder ersetzt werden
  oder nur Initialen erscheinen? Gilt die Auswahl für alle oder einzelne Personen?
- Für eigene Avatare: Welche Datei gehört zu welcher Demo-/SIGNL4-Personen-ID?
  Kläre fehlende Zuordnungen, bevor Overrides geschrieben werden.
- Auf welchen Geräten soll der Splash Screen funktionieren: installierte
  Chromium-PWA, iOS oder ein eigener App-Ladebildschirm? Frage nur, wenn dies
  aus dem Auftrag noch offen ist und für die Einbindung relevant wird.

## Social-Vorschau

Das Open-Graph-Bild gehört immer zum Ergebnis. Frage nach zusätzlichen Text-
oder Motivwünschen, wenn diese offen sind; Name, Farben und Logo müssen nicht
nochmals abgefragt werden. Ohne abweichenden Wunsch gestalte eine Vorschau mit
Logo, Portalname und gegebenenfalls Claim. Erstelle die fertige Datei als
`public/og-image.png` (1200 × 630 Pixel) und binde sie in das gebaute HTML ein.

## Antworten verwenden

Halte den Markenbrief knapp fest: Name, Claim, Beschreibung, Farben, Logoquelle,
Icon-Variante, Avatar-Modus/Zuordnung, OG-Bildgestaltung und gewünschte Zielplattform. Bekannte Werte
können unmittelbar umgesetzt werden. Noch offene Asset-Entscheidungen bleiben
sichtbar offen; ersetze sie nicht ungefragt durch Acme-Assets oder erfundene Fotos.
Bietet der Nutzer ausdrücklich freie Gestaltung oder vorläufige Platzhalter an,
setze dies um und benenne die gewählten Defaults im Ergebnis.
