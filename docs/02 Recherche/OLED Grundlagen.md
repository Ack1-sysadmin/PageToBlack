---
tags: [recherche, oled]
status: lebend
---

# OLED Grundlagen

Was ein OLED-Panel von einem Dark Mode verlangt – und warum „dunkelgrau“ nicht reicht.

## Eigenschaften, die uns betreffen
- **Selbstleuchtende Pixel:** `#000000` = Pixel aus → unendlicher Kontrast, kein Glow. Schon `#0a0a0a` schaltet Pixel ein.
- **Energie:** Schwarze Flächen sparen Strom (relevant bei Laptops/Handys, am Desktop eher Nebeneffekt).
- **ABL (Automatic Brightness Limiter):** Große helle Flächen lassen das ganze Bild dunkler werden. Weniger helle Fläche = stabilere Helligkeit.
- **Einbrennen (Burn-in):** Statische, helle Elemente (Logos, Navbars, Tab-Leisten, Untertitel) altern Subpixel ungleichmäßig. Moderne Monitore haben Pixel-Refresh, das Risiko sinkt, verschwindet aber nicht.
- **Near-Black-Verhalten:** Viele Panels zeigen in sehr dunklen Graustufen Banding, Farbstiche oder VRR-Flackern. Flächen knapp über Schwarz (≈ `#010101`–`#121212`) wirken daher unruhig.
- **Black Smear:** Vor allem bei manchen OLED-Smartphones (niedrige Helligkeit) beim Übergang von „aus“ zu „an“ sichtbar; bei Desktop-OLEDs selten. Beobachten, nicht überbewerten.
- **Subpixel-Layout:** QD-OLED (Dreieck) und WOLED (RWBG) passen nicht zu ClearType → Farbsäume an Text. **Nicht per Extension lösbar** (Betriebssystem-Rendering).

## Abgeleitete Designregeln für PageToBlack
1. **Hintergründe → exakt `#000000`.** Auch Sekundärflächen (Karten, Sidebars), solange sie „Fläche“ sind.
2. **Kein Near-Black.** Entweder `#000` oder klar unterscheidbar (≥ ca. `#1a1a1a`), nichts dazwischen – siehe [[Farbalgorithmus]].
3. **Ebenen über Rahmen statt Flächen:** 1px-Border in Dunkelgrau statt grauer Kartenflächen.
4. **Text nicht reinweiß:** Standard etwa `#d8d8d8`–`#e6e6e6`, einstellbar. Reduziert Blendung/Halo und Panelbelastung.
5. **Bilder optional dimmen** (z. B. `brightness(0.85)`), große weiße Bildflächen sind „Leuchtflächen“.
6. **Einbrennschutz-Option:** Statische, helle UI-Teile (fixed/sticky) zusätzlich abdunkeln.
7. **Akzentfarben entsättigen/abdunkeln**, damit sie auf Schwarz nicht „glühen“.

## Offene Punkte
- Konkrete Werte (Textgrau, Near-Black-Schwelle) an echten Panels testen → [[Offene Fragen]]

## Verwandt
[[Farbalgorithmus]] · [[Vision]] · [[Glossar]]
