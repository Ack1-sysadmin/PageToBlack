# PageToBlack

**Echter OLED-Dark-Mode für jede Webseite.** Eine Chrome-Erweiterung (Manifest V3), angelehnt an [Dark Reader](https://darkreader.org/), aber konsequent für OLED-Monitore optimiert:

- 🖤 **Echtes `#000000`** – auch für Karten, Menüs und Sidebars, nicht nur den Seitenhintergrund
- 🌑 **Bereits dunkle Seiten schwärzen** – YouTube, GitHub, Discord & Co. von `#121212` auf `#000`
- 👁️ **Gedämpfter Text** statt grellem Weiß
- 🛡️ **Einbrennschutz** für statische, helle Elemente

> Status: **Prototyp (M0)** – Filter-Modus mit OLED-Kurve, einfaches Blackening dunkler Seiten, Popup (DE/EN), Tastenkürzel <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>.

## Entwicklung
Voraussetzung: Node.js ≥ 20.

```sh
npm install
npm run dev        # startet Chrome mit geladener Erweiterung und Hot Reload
npm run build      # Build nach .output/chrome-mv3
npm run zip        # ZIP für den Chrome Web Store
```

Manuell laden: `chrome://extensions` → Entwicklermodus → *Entpackte Erweiterung laden* → `.output/chrome-mv3`.

Tests (Playwright mit echter Erweiterung, Pixelprüfung im Screenshot):

```sh
npx playwright install chromium   # einmalig
npm run test:e2e
```

| Pfad | Inhalt |
|---|---|
| `src/entrypoints/content.ts` | Content Script: Anti-Weißblitz, Erkennung, Moduswahl |
| `src/utils/engine.ts` | Filter-/Blackening-CSS und OLED-Kurve |
| `src/utils/detect.ts` | Erkennung, ob eine Seite bereits dunkel ist |
| `src/entrypoints/popup/` | Popup-UI |
| `public/_locales/` | Übersetzungen (en, de) |
| `tests/` | E2E-Tests und Testseiten |

## Wissensdatenbank
Die Projektdokumentation ist ein [Obsidian](https://obsidian.md/)-Vault im Ordner [`docs/`](docs/).
In Obsidian: *Open folder as vault* → `docs` auswählen. Einstieg: [`docs/00 Start/Home.md`](docs/00%20Start/Home.md).

Wichtige Notizen:
- [Machbarkeitsanalyse](docs/02%20Recherche/Machbarkeitsanalyse.md)
- [Roadmap](docs/01%20Projekt/Roadmap.md)
- [Offene Fragen](docs/01%20Projekt/Offene%20Fragen.md)

## Lizenz
[MIT](LICENSE)
