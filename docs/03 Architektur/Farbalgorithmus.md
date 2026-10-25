---
tags: [architektur, oled]
status: entwurf
---

# Farbalgorithmus

Kern von PageToBlack: Wie wird eine beliebige Farbe auf eine OLED-gerechte Farbe abgebildet? Gerechnet wird in einem wahrnehmungsnahen Farbraum (**OKLCH**), damit Helligkeit und Sättigung unabhängig steuerbar sind.

## Rollen
Jede Farbe wird je nach CSS-Eigenschaft einer Rolle zugeordnet:

| Rolle | Eigenschaften | Ziel |
|---|---|---|
| **Fläche** | `background-color`, Verläufe | → `#000` (bzw. Elevation-Regel) |
| **Text** | `color`, `fill` bei Text-SVG | → hell, max. `textMax` (Standard ≈ `#f0f0f0`); graue Textfarben werden angehoben |
| **Rahmen** | `border-color`, `outline`, `box-shadow` | → Dunkelgrau, klar sichtbar |
| **Akzent** | gesättigte Farben (Links, Buttons) | Farbton behalten, Helligkeit/Sättigung begrenzen |

## Regeln (Entwurf)
1. **Flächen:** `L_neu = 0` → `#000`. Ausnahme: gesättigte Flächen (Buttons, Badges) behalten Farbton mit stark reduzierter Helligkeit.
2. **Near-Black-Klemme:** Jede Fläche mit `L < L_clamp` (≈ 0.12) wird `#000`. Verhindert unruhige Fast-Schwarz-Töne (siehe [[OLED Grundlagen]]). → Das ist auch der Kern des *Dark-Site-Blackening*.
3. **Elevation:** Ebenen, die sich *nur* durch Helligkeit vom Untergrund abheben (Karten, Menüs), werden `#000` + Rahmen (`#2a2a2a`) statt grauer Fläche. Optionaler Modus „sanfte Ebenen“: genau eine Stufe `#1a1a1a`.
4. **Text:** Helligkeit invertieren, auf `[textMin, textMax]` begrenzen; Kontrast ≥ WCAG AA gegen `#000` sicherstellen.
5. **Transparenz:** Alpha-Farben gegen den *gemappten* Untergrund mischen, nicht gegen Weiß.
6. **Bilder:** unverändert, optional `filter: brightness(x)`; Hintergrundbilder mit überwiegend weißer Fläche (Erkennung per Canvas-Stichprobe, wo CORS erlaubt) dimmen.

## Parameter (Benutzer-einstellbar)
`textMax`, `L_clamp`, Elevation-Modus (Rahmen / sanft), Bild-Dimmen, Akzent-Sättigung, Einbrennschutz an/aus.

## Testfälle
- Weiße Seite (Wikipedia) · Material-Dark (`#121212`) · GitHub Dark (`#0d1117`) · YouTube (`#0f0f0f`) · Seiten mit Verläufen/Hero-Bildern · Formulare/Inputs

## Verwandt
[[Rendering-Modi]] · [[OLED Grundlagen]] · [[Architekturentwurf]]
