---
tags: [adr]
status: akzeptiert
datum: 2026-10-25
---

# ADR-0001: Manifest V3 als Plattform

## Kontext
Chrome akzeptiert im Web Store nur noch Manifest-V3-Erweiterungen; MV2 ist abgeschaltet.

## Entscheidung
PageToBlack wird ausschließlich als **Manifest V3**-Erweiterung gebaut.

## Konsequenzen
- Service Worker statt persistenter Background Page → State in `chrome.storage`
- Kein Remote Code → Site-Fixes nur als Daten
- Alle benötigten APIs vorhanden (siehe [[Chrome Manifest V3]])
