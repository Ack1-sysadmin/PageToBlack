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
- ~~`filter` erzeugt neuen Containing Block → `position: fixed` bricht~~ – gilt nicht für das Root-Element (in M0 per Test bestätigt); GPU-Last beim Scrollen beobachten
- Gut als schneller Prototyp und als Notlösung für problematische Seiten

### Umsetzung in M0
- Filter auf `<html>`: `invert(1) hue-rotate(180deg) url(#ptb-oled-curve)`. Die SVG-Kurve (`feComponentTransfer`, Code: `src/utils/curve.ts`):
  - unter `blackThreshold` (0,08) → `#000` (fast weiße Flächen)
  - darüber Ease-out von `minVisible` (0,08) bis `textMax` (0,97 ≈ `#f7f7f7`): hebt graue Textfarben an (`#666` → ≈ `#cccccc`, GitHub `#1f2328` → ≈ `#f3f3f3`), Rahmen bleiben sichtbar
- Medien bekommen vorab die **exakte Umkehrkurve** (`#ptb-media-curve`), damit sie nicht mit aufgehellt werden: Ergebnis = Original × `textMax`.
- ~~Lineare Dimmung `v × 0,88`~~ (erste M0-Version): machte grauen Text noch grauer (`#666` → `#878787`), siehe [[Test M0 2026-10-25]].
- `position: fixed` bleibt intakt, weil der Filter auf dem Root-Element sitzt (die Spezifikation nimmt das Root-Element von der Containing-Block-Regel aus).
- Content Script nur im Top-Frame. iframes werden vom Elternfilter mit invertiert, deshalb werden sie wie Medien zurückinvertiert.

### Bekannte Einschränkungen des Filter-Modus
- **Sättigungsverlust bei Bildern:** `hue-rotate` hebt sich nur ohne Clipping exakt auf. Natürliche Fotofarben (z. B. Hauttöne) bleiben korrekt, sehr gesättigte Farben (reines Rot → `#973737`) verlieren Sättigung.
- **Dunkle Elemente auf hellen Seiten werden hell**, z. B. die dunkle Kopfleiste von GitHub (helles Theme) → große hellgraue Fläche. Abhilfe in M1: `prefers-color-scheme` erzwingen.
- Hintergrundbilder aus Stylesheets (nicht inline) werden nicht zurückinvertiert.
- Eingebettete iframes erscheinen im Original (also ggf. hell).

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
