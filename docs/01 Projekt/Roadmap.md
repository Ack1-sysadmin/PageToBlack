---
tags: [projekt]
status: entwurf
---

# Roadmap

## M0 – Prototyp ✅ (2026-10-25)
- [x] Projekt-Setup: TypeScript, WXT, MV3-Manifest
- [x] Bootstrap-Script mit Anti-Weißblitz
- [x] Filter-Modus inkl. Medien-Rückinvertierung und OLED-Kurve
- [x] Einfaches Blackening für dunkle Seiten (nur `html`/`body`)
- [x] Popup: an/aus global und pro Seite (DE/EN)
- [x] Tastenkürzel Alt+Shift+B (Seite an/aus)
- [x] Automatische Tests (Playwright) + Stichprobe echter Seiten → [[Test M0 2026-10-25]]
- [ ] Manueller Test auf dem G61SH

## M1 – MVP (2–3 Wochen)
- [ ] Dark-Site-Blackening für alle Flächen, nicht nur `html`/`body` ([[Rendering-Modi]])
- [ ] **`prefers-color-scheme` erzwingen**: Seiten mit eigenem Dark Mode (GitHub, Wikipedia …) in diesen schalten statt invertieren – vermeidet hell invertierte Kopfleisten
- [x] Erkennung „Seite ist dunkel“ (Basis in M0)
- [ ] Einstellungen: Textgrau, Near-Black-Schwelle, Bild-Dimmen
- [ ] Seitenlisten (Ausschluss / fester Modus)
- [ ] Einfacher Einbrennschutz (statische helle Elemente dimmen) – vorgezogen wegen Mehrmonitor-Setup, siehe [[Testhardware]]
- [ ] Kalibrier-Testseite (Graustufen-Treppe, Textweiß-Stufen)
- [ ] Testseiten-Sammlung + Playwright-Screenshots

## M2 – Beta (1–3 Monate, iterativ)
- [ ] Dynamischer Modus nach [[Farbalgorithmus]]
- [ ] CORS-Stylesheets über Service Worker
- [ ] Shadow DOM / Adopted Stylesheets
- [ ] Einbrennschutz erweitern (Profile pro Monitor prüfen)
- [ ] Site-Fixes als Datendatei
- [ ] Performance-Messung auf großen Seiten

## M3 – Veröffentlichung (2–4 Wochen)
- [ ] Icons, Store-Screenshots, Beschreibung (DE/EN)
- [ ] Datenschutzerklärung (keine Datenerhebung)
- [ ] Chrome Web Store Developer-Account (einmalige Gebühr)
- [ ] Release-Workflow (GitHub Actions → ZIP)

## Später
- Firefox/Edge-Port, Zeitplan (nur nachts), Community-Site-Fixes
