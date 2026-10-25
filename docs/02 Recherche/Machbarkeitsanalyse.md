---
tags: [recherche, entscheidung]
status: abgeschlossen
datum: 2026-10-25
---

# Machbarkeitsanalyse

## Ergebnis in einem Satz
**Machbar.** Alle nötigen Bausteine stehen unter [[Chrome Manifest V3]] zur Verfügung, und Dark Reader (MIT-Lizenz) beweist seit Jahren, dass generisches Umfärben beliebiger Webseiten funktioniert. Das Risiko liegt nicht in der Plattform, sondern in der **Robustheit über Millionen unterschiedlicher Seiten** – das ist eine Frage des Aufwands und der Teststrategie, nicht der Möglichkeit.

## Bewertung nach Bereichen

| Bereich | Machbarkeit | Risiko | Kommentar |
|---|---|---|---|
| Content Scripts bei `document_start` | ✅ hoch | gering | Standard-MV3-Funktion; frühes Schwarz gegen Weißblitzen |
| Filter-Modus (CSS `filter`) | ✅ hoch | gering | In wenigen Tagen umsetzbar, siehe [[Rendering-Modi]] |
| Dark-Site-Blackening | ✅ hoch | mittel | Kernfeature, gut abgrenzbar, hoher Nutzen |
| Dynamischer Modus (CSS-Umschreibung) | ✅ machbar | **hoch** | Viel Fleißarbeit: CSSOM, Inline-Styles, Shadow DOM, CORS-Stylesheets, CSS-Variablen |
| Bilder/Videos/Canvas | ⚠️ teilweise | mittel | Nur dimmen/filtern, nicht pixelgenau umfärben |
| Performance auf großen Seiten | ⚠️ machbar | mittel | MutationObserver + Batching + Caches nötig |
| Settings, Seitenliste, Popup | ✅ hoch | gering | `chrome.storage`, Action-Popup |
| Web-Store-Veröffentlichung | ✅ hoch | gering | `<all_urls>`-Berechtigung → ausführlichere Prüfung, aber üblich |
| Subpixel-/ClearType-Probleme (QD-OLED/WOLED) | ❌ nicht lösbar | – | Liegt beim Betriebssystem, nicht im Browser |
| `prefers-color-scheme` erzwingen | ⚠️ Workaround | mittel | Keine Extension-API; Umweg über Umschreiben der `@media`-Regeln |

## Die drei schwierigen Stellen
1. **Generisches Umfärben ohne Kaputtmachen.** Seiten nutzen Hintergrundbilder, Verläufe, transparente Ebenen, CSS-Variablen, `!important`-Kaskaden, Shadow DOM (Web Components) und Canvas. Dark Readers Dynamic-Engine ist genau deshalb über Jahre gewachsen.
2. **Weißblitzen (FOUC) beim Laden.** Lösbar durch ein sofort injiziertes `html,body{background:#000!important}` bei `document_start`, bevor die eigentliche Engine läuft.
3. **Cross-Origin-Stylesheets.** `cssRules` fremder Domains sind nicht lesbar → Stylesheet über den Service Worker per `fetch` nachladen (braucht Host-Permissions), dann umschreiben.

## Aufwandsschätzung (grob, 1 Entwickler:in)
| Meilenstein | Umfang | Schätzung |
|---|---|---|
| M0 Prototyp | Filter-Modus + Anti-Blitz + Toggle | 2–4 Tage |
| M1 MVP | Dark-Site-Blackening, Seitenliste, Popup, Einstellungen | 2–3 Wochen |
| M2 Beta | Dynamischer Modus für helle Seiten | 1–3 Monate (iterativ) |
| M3 Store | Feinschliff, Site-Fixes, Store-Listing | 2–4 Wochen |

Details: [[Roadmap]]

## Strategische Empfehlung
- **Mit dem Alleinstellungsmerkmal starten:** *Dark-Site-Blackening* + Filter-Modus. Das ist schnell, nützlich und unterscheidet uns klar – Dark Reader kann zwar Hintergrund `#000` einstellen, mappt aber Ebenen relativ (Karten werden grau) und ignoriert bereits dunkle Seiten.
- **Dynamischen Modus danach** iterativ bauen, mit Dark Reader als Referenz (siehe [[ADR-0002 Eigene Engine statt Fork]]).
- **Früh eine Testseiten-Sammlung** (Top-Sites + Problemfälle) aufbauen und per Screenshot-Vergleich prüfen.

## Verwandt
[[OLED Grundlagen]] · [[Dark Reader Analyse]] · [[Architekturentwurf]] · [[Offene Fragen]]
