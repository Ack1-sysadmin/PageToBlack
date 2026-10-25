---
tags: [recherche, wettbewerb]
status: lebend
quelle: https://github.com/darkreader/darkreader
---

# Dark Reader Analyse

Dark Reader ist die Referenz für generische Dark Modes im Browser. Open Source unter **MIT-Lizenz** – wir dürfen Code lesen, lernen und (mit Lizenzhinweis) übernehmen.

## Modi von Dark Reader
| Modus | Prinzip | Stärken | Schwächen |
|---|---|---|---|
| **Dynamic** | Liest alle Stylesheets/Inline-Styles, berechnet Farben neu, injiziert Override-CSS | Beste Qualität, Bilder bleiben unverändert | Komplex, CPU-intensiv, Edge Cases |
| **Filter** | `filter: invert() hue-rotate()` auf die ganze Seite, Medien zurückinvertieren | Einfach, schnell zu bauen | `position: fixed` bricht, Farben verfälscht, GPU-Last |
| **Filter+** | Filter mit SVG-Filtern (genauere Farbmatrix) | Bessere Farben als Filter | Ähnliche Probleme |
| **Static** | Generiertes/kuratiertes CSS je Seite | Leichtgewichtig | Wenig generisch |

Zusätzlich: **Site-Fixes** (Community-gepflegte CSS-/Selektor-Korrekturen je Domain), Erkennung bereits dunkler Seiten, Zeitplan, Schriftart-Optionen.

## Warum Dark Reader für OLED nicht ideal ist
- Hintergrundfarbe lässt sich auf `#000` setzen, **aber** Farben werden *relativ* gemappt: was auf der Originalseite heller als der Hintergrund war, wird zu Dunkelgrau → Karten, Menüs, Inputs bleiben grau.
- **Bereits dunkle Seiten** werden erkannt und standardmäßig nicht angefasst → `#121212`-Seiten bleiben grau.
- Kein expliziter **Einbrennschutz**, kein Konzept „Ebenen über Rahmen“.
- Viele Optionen (Helligkeit, Kontrast, Sepia, Graustufen) – für unseren Zweck eher Ballast.

## Was wir lernen/übernehmen können
- Architektur der Dynamic-Engine (Stylesheet-Sammlung, Varianten-Cache, MutationObserver, Shadow-DOM-Behandlung)
- Umgang mit CORS-Stylesheets über den Background-Kontext
- Format der Site-Fixes (evtl. kompatibel halten)
- Erkennung „Seite ist schon dunkel“

## Verwandt
[[Wettbewerb]] · [[Rendering-Modi]] · [[ADR-0002 Eigene Engine statt Fork]]
