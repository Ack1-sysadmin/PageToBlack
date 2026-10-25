---
tags: [recherche, plattform]
status: lebend
quelle: https://developer.chrome.com/docs/extensions/
---

# Chrome Manifest V3

Rahmenbedingungen der Plattform für PageToBlack.

## Relevante Bausteine
| API / Feature | Nutzung bei uns |
|---|---|
| `content_scripts` mit `run_at: document_start`, `all_frames: true` | Engine früh in jede Seite und jeden iframe laden |
| `match_about_blank` / `match_origin_as_fallback` | Auch leere/ursprungslose Frames abdecken |
| `chrome.scripting` | Dynamisches Ein-/Ausschalten, CSS injizieren |
| `chrome.storage.sync` / `.local` | Einstellungen, Seitenlisten (sync ist größenbegrenzt) |
| `chrome.action` | Popup + Badge (an/aus je Seite) |
| `chrome.commands` | Tastenkürzel (z. B. Alt+Shift+B) |
| Service Worker (Background) | Einstellungen verteilen, Cross-Origin-Stylesheets per `fetch` laden |
| `world: "MAIN"` | Falls nötig: Eingriffe in Seitenkontext (z. B. `matchMedia`) |

## Einschränkungen
- **Kein Remote Code:** Engine und Site-Fixes müssen im Paket stecken (oder Fixes als *Daten*, nicht als Code, nachladen).
- **Service Worker ist flüchtig:** kein dauerhafter State im Background, alles in `storage`.
- **Keine geschützten Seiten:** `chrome://`, Chrome Web Store, PDF-Viewer, `view-source:` sind nicht erreichbar.
- **`prefers-color-scheme` nicht per API überschreibbar** → Workaround: `@media (prefers-color-scheme: dark)`-Regeln im CSSOM entklammern.
- **Berechtigungen:** `<all_urls>` / `host_permissions` lösen Warnhinweis und genauere Store-Prüfung aus. Alternative: optionale Host-Permissions pro Seite (schlechtere UX).

## Fazit
Alles, was wir brauchen, ist unter MV3 vorhanden. Dark Reader läuft selbst unter MV3. → [[ADR-0001 Manifest V3]]

## Verwandt
[[Architekturentwurf]] · [[Machbarkeitsanalyse]]
