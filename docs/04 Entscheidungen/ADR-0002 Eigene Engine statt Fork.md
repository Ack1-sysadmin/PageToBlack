---
tags: [adr]
status: vorgeschlagen
datum: 2026-10-25
---

# ADR-0002: Eigene Engine statt Dark-Reader-Fork

## Kontext
Dark Reader ist MIT-lizenziert und technisch ausgereift. Ein Fork würde sofort eine funktionierende Dynamic-Engine liefern.

## Optionen
| | Fork | Eigene Engine |
|---|---|---|
| Startgeschwindigkeit | sehr schnell | langsamer |
| Codebasis | groß, viele Features, die wir nicht brauchen | schlank, auf OLED zugeschnitten |
| Upstream-Merges | dauerhafter Aufwand | entfällt |
| Farblogik | relatives Mapping tief verankert | OLED-Regeln von Anfang an |
| Eigenständigkeit/Store | „noch ein Dark-Reader-Klon“ | klares eigenes Produkt |

## Entscheidung (Vorschlag)
**Eigene, schlanke Engine.** Dark Reader dient als Referenz für schwierige Teile (CORS-Stylesheets, Shadow DOM, Observer). Übernommene Code-Stücke werden mit MIT-Hinweis gekennzeichnet.

## Konsequenzen
- MVP (Filter + Blackening) schnell machbar, ohne Fremdcode
- Dynamischer Modus dauert länger als beim Fork
- Neubewertung nach M1 möglich

> [!question] Wartet auf Bestätigung durch Projektinhaber → [[Offene Fragen]]
