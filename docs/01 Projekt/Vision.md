---
tags: [projekt]
status: entwurf
---

# Vision

**PageToBlack** macht jede Webseite OLED-tauglich: echte schwarze Hintergründe (Pixel aus), augenschonender Text, Schutz vor Einbrennen – ohne dass Seiten kaputtgehen.

## Zielgruppe
- Nutzer:innen von OLED-/QD-OLED-Monitoren (Desktop, Laptop) und OLED-Notebooks
- Menschen, die nachts lesen und maximale Dunkelheit wollen

## Kernversprechen (USP gegenüber [[Dark Reader Analyse|Dark Reader]])
1. **Wirklich `#000`** – nicht nur der Seitenhintergrund, sondern auch Karten, Menüs, Sidebars, Modals.
2. **Bereits dunkle Seiten schwärzen** („Dark-Site-Blackening“): YouTube `#0f0f0f`, GitHub `#0d1117`, Discord, Reddit … → `#000`. Dark Reader lässt solche Seiten meist unangetastet.
3. **OLED-gerechter Text** – gedämpftes Weiß statt `#fff` (weniger Blendung/Halo, weniger Belastung des Panels).
4. **Einbrennschutz** – optionales Dimmen statischer, heller Elemente (Logos, Sticky-Header, Badges).
5. **Kontrast ohne Grauflächen** – Ebenen werden durch dünne Rahmen statt graue Flächen unterschieden.

## Nicht-Ziele (vorerst)
- Kein Firefox/Safari im MVP (später via WebExtension-API denkbar)
- Keine Cloud-Sync-Infrastruktur, kein Tracking, keine Accounts
- Kein Nachbau sämtlicher Dark-Reader-Features

## Verwandt
[[Machbarkeitsanalyse]] · [[Roadmap]] · [[OLED Grundlagen]]
