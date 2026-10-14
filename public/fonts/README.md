# Local fonts

- **Vazirmatn**: Persian and Arabic, variable weights 100–900; version 33.003 from the [official project](https://github.com/rastikerdar/vazirmatn/tree/v33.003).
- **Nunito Sans**: English, Dutch and other Latin text, variable weights 200–900; Latin and Latin Extended WOFF2 subsets from [Google Fonts](https://fonts.google.com/specimen/Nunito+Sans).

Both fonts are distributed under the SIL Open Font License. Keep the included `*-OFL.txt` files when redistributing these fonts. Original download URLs and SHA-256 checksums are recorded in `sources.json`.

The font faces are defined in `src/style/fonts.css`. No third-party font requests are made at runtime. The locale layout preloads the Latin font and, for Persian pages, Vazirmatn. Extended Latin glyphs and Persian text on Latin pages load their local font files as needed.

Typography sizes, weights and line heights are defined in `src/style/globals.css`; component styles reference those tokens. Body text starts at `1rem`, headings use responsive `clamp()` sizes, and form inputs stay at `1rem`.
