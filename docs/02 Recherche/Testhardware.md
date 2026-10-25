---
tags: [recherche, oled, hardware]
status: lebend
datum: 2026-10-25
---

# Testhardware

Primäres Testsetup: **3× Samsung Odyssey OLED G6 – G61SH** (Mehrmonitor-Setup).

## Eckdaten (laut Händler-/Presseangaben, nicht offiziell verifiziert)
| Merkmal | Wert |
|---|---|
| Diagonale / Auflösung | 27″, 2560 × 1440 (QHD) |
| Panel | **QD-OLED** (die meisten Quellen; ein Listing nennt nur „OLED“) |
| Bildwiederholrate | 240 Hz, 0,03 ms GtG |
| Spitzenhelligkeit | ca. 400 nits (Angaben schwanken) |
| Farbraum | ~99 % DCI-P3, Pantone Validated |
| Oberfläche | Anti-Glare (matt) |
| VRR | FreeSync Premium, G-Sync-kompatibel |

Quellen: [Notebookcheck](https://www.notebookcheck.net/Samsung-launches-affordable-1440p-QD-OLED-monitor-with-240Hz-and-Pantone-Validated-display.1246670.0.html), [Pangoly](https://pangoly.com/en/product/samsung-odyssey-oled-g6-g61sh), [buildcores](https://www.buildcores.com/products/Monitor/evs0xogm1/Samsung-Odyssey-OLED-G6-G61SH-27-inch-QHD-240Hz-Gaming-Monitor)

## Was das für PageToBlack bedeutet
- **QD-OLED-Subpixel (Dreieck-Layout):** Farbsäume an Text durch ClearType sind zu erwarten; per Extension nicht lösbar. Text-Kontrast deshalb nicht übertreiben – gedämpftes Weiß wirkt hier ruhiger. Tipp außerhalb der Extension: ClearType-Tuner bzw. Graustufen-Antialiasing testen.
- **Schwarz bei Umgebungslicht:** QD-OLED-Panels wirken bei hellem Raumlicht nicht tiefschwarz, sondern leicht gräulich (Panel-Eigenschaft). Tests von `#000` vs. Near-Black daher **im abgedunkelten Raum** und **bei Tageslicht** machen.
- **VRR-Flackern in dunklen Grautönen:** Bei schwankender Framerate (Scrollen, Animationen) können Near-Black-Flächen flackern → bestätigt die Regel „`#000` oder klar sichtbares Grau“ aus [[Farbalgorithmus]].
- **Drei Monitore = viel statischer Inhalt:** Seitenmonitore zeigen oft stundenlang dieselbe Seite (Dashboards, Chats, Docs). Der **Einbrennschutz** (statische helle Elemente dimmen) bekommt dadurch höhere Priorität.
- **Idee für später:** Profile pro Monitor (z. B. stärkeres Dimmen auf Seitenmonitoren) über die Window-Management-API (`getScreenDetails`). Benötigt eine eigene Berechtigung – Machbarkeit separat prüfen.

## Kalibrier-Testplan (für [[Offene Fragen]] #6)
- [ ] Testseite mit Graustufen-Treppe `#000`–`#2a2a2a` in 1er-Schritten: ab welchem Wert ist Grau ruhig und klar von Schwarz unterscheidbar? → `L_clamp`
- [ ] Text-Weißstufen `#c8c8c8`–`#ffffff` auf `#000`: angenehmster Wert für Fließtext → `textMax`
- [ ] Beides im dunklen Raum und bei Tageslicht
- [ ] Scroll-Test mit 240 Hz und mit VRR-Schwankungen (Flackern?)

## Verwandt
[[OLED Grundlagen]] · [[Farbalgorithmus]] · [[Vision]]
