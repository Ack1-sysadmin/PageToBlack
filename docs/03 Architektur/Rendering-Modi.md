---
tags: [architektur]
status: entwurf
---

# Rendering-Modi

## 1. Dark-Site-Blackening ⭐ (MVP, USP)
Für Seiten, die **schon dunkel** sind (erkannt über berechnete Hintergrundfarbe von `html`/`body`/großen Containern oder aktiven `prefers-color-scheme: dark`-Regeln).
- Alle Flächenfarben unter `L_clamp` → `#000` (siehe [[Farbalgorithmus]])
- Optional: Seiten mit eigenem Dark Mode, die ihn nur per `prefers-color-scheme` aktivieren, durch Umschreiben der `@media`-Regeln in den Dark Mode zwingen
- Geringes Risiko, Seite zu zerstören, weil das Design schon dunkel gedacht ist

## 2. Filter-Modus (MVP, Fallback)
`html { filter: invert(1) hue-rotate(180deg) }`, Medien (`img, video, picture, canvas, svg image, [style*=background-image]`) zurückinvertieren.
- Weiß → `#000` automatisch; Hellgrau (`#f5f5f5`) wird `#0a0a0a` → zusätzliche Kontrast-/Helligkeitskurve, um Near-Black zu Schwarz zu drücken
- Bekannte Probleme: `filter` erzeugt neuen Containing Block → `position: fixed` verhält sich anders; GPU-Last bei Scrollen
- Gut als schneller Prototyp und als Notlösung für problematische Seiten

## 3. Dynamischer Modus (Beta)
Analog zu Dark Readers Dynamic Mode, aber mit OLED-Regeln:
- Stylesheets (inkl. CORS über Service Worker), `<style>`, Inline-Styles, Adopted Stylesheets, Shadow Roots einsammeln
- Farbwerte je Rolle mappen, Override-Stylesheet erzeugen, CSS-Variablen auflösen/umschreiben
- MutationObserver für dynamische Inhalte (SPAs)
- Höchste Qualität, höchster Aufwand

## Auswahllogik
```
Seite in Ausschlussliste?        → nichts tun
Seite bereits dunkel?            → Blackening
Nutzer hat Modus für Seite fest? → diesen
sonst                            → Standardmodus (MVP: Filter, später: Dynamisch)
```

## Verwandt
[[Architekturentwurf]] · [[Dark Reader Analyse]]
