---
tags: [adr]
status: akzeptiert
datum: 2026-10-25
---

# ADR-0004: Zweisprachige UI (DE/EN)

## Kontext
Die Zielgruppe ist international, der Projektinhaber deutschsprachig.

## Entscheidung
Popup, Options-Seite und Store-Listing gibt es auf **Deutsch und Englisch**, umgesetzt über `chrome.i18n` (`_locales/de/messages.json`, `_locales/en/messages.json`). `default_locale` ist `en`; Chrome wählt automatisch nach Browsersprache.

## Konsequenzen
- Im Code keine festen UI-Texte, nur Message-Keys
- Neue Texte immer gleich in beiden Sprachen anlegen
- Die Projektdokumentation (dieser Vault) bleibt deutsch, Code-Kommentare und Commits im Code-Teil englisch
