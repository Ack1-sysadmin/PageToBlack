---
tags: [projekt, fragen]
status: offen
---

# Offene Fragen

| # | Frage | Optionen | Empfehlung | Status |
|---|---|---|---|---|
| 1 | Eigene Engine oder Dark-Reader-Fork? | Fork / eigene schlanke Engine | Eigene Engine | ✅ entschieden → [[ADR-0002 Eigene Engine statt Fork]] |
| 2 | Lizenz des Projekts? | MIT / GPL-3.0 / proprietär | MIT | ✅ entschieden → [[ADR-0003 MIT-Lizenz]] |
| 3 | Sprache der UI? | DE / EN / beide | Beide | ✅ entschieden → [[ADR-0004 Zweisprachige UI]] |
| 4 | Build-Tooling? | Vite+CRXJS / WXT / Plain esbuild | WXT oder Vite – kurz vergleichen | offen |
| 5 | Monetarisierung? | Gratis / Spende / Pro-Features | Gratis + Spendenlink | offen |
| 6 | Zielwerte Textgrau & Near-Black-Schwelle | – | Vorläufig `textMax` 0,94 (`#f0f0f0`), `blackThreshold` 0,08; final per Kalibrier-Testplan in [[Testhardware]] | offen |
| 7 | Welches OLED-Panel ist vorhanden? | – | 3× Samsung Odyssey OLED G6 G61SH (QD-OLED) | ✅ geklärt → [[Testhardware]] |
| 8 | Standardmodus für helle Seiten im MVP | Filter / erst ab Beta dynamisch | Filter im MVP | vorgeschlagen |

Beantwortete Fragen → als ADR in `04 Entscheidungen` festhalten.
