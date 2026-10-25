---
tags: [moc]
aliases: [Start, Index]
---

# PageToBlack – Wissensdatenbank

> Chrome-Erweiterung, die Webseiten in einen **echten OLED-Dark-Mode** (`#000000`) verwandelt – angelehnt an Dark Reader, aber konsequent für OLED-Panels optimiert.

## Einstieg
- [[Vision]] – Was PageToBlack sein soll und was nicht
- [[Machbarkeitsanalyse]] – Ergebnis der Machbarkeitsprüfung ⭐
- [[Roadmap]] – Phasen vom Prototyp bis zum Web Store
- [[Offene Fragen]] – Entscheidungen, die noch ausstehen

## Recherche
- [[OLED Grundlagen]] – Was OLED-Panels von einem Dark Mode verlangen
- [[Dark Reader Analyse]] – Wie Dark Reader funktioniert und was wir übernehmen können
- [[Chrome Manifest V3]] – Plattform-Rahmenbedingungen
- [[Wettbewerb]] – Bestehende Lösungen und unsere Lücke
- [[Testhardware]] – Samsung Odyssey OLED G6 (G61SH) ×3

## Architektur
- [[Architekturentwurf]] – Komponenten der Erweiterung
- [[Farbalgorithmus]] – Wie Farben auf OLED-Schwarz gemappt werden
- [[Rendering-Modi]] – Filter, Dynamisch, Dark-Site-Blackening

## Entscheidungen (ADR)
- [[ADR-0001 Manifest V3]]
- [[ADR-0002 Eigene Engine statt Fork]]
- [[ADR-0003 MIT-Lizenz]]
- [[ADR-0004 Zweisprachige UI]]

## Sonstiges
- [[Glossar]]
- Vorlagen liegen in `99 Templates` (Obsidian → *Vorlage einfügen*)

## Konventionen
- Neue Notizen in den passenden Ordner, mit Frontmatter (`tags`, ggf. `status`).
- Entscheidungen als ADR mit fortlaufender Nummer festhalten (Vorlage: [[ADR-Vorlage]]).
- Links immer als `[[Wikilink]]`, Bilder nach `assets/`.
