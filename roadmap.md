# DJ BUFALO — Roadmap

## Completed

- **Core Site & Design System**: Locked 5-token palette, archival typography, and SCSS component system (`design-system.md`, `style-guide.md`, `assets/sass/`).
- **Multi-Page Architecture**: Dedicated sections for `/fechas/`, `/sets/`, `/musica/`, `/bio/`, `/merch/`, `/epk/`, `/cronicas/`, `/despachos/`, and custom `404.html` + `robots.txt`.
- **Parody & Archive Content**:
  - `data/sets.yaml` with per-set `tracklist` entries rendered on `/sets/`.
  - `data/releases.yaml` with catalog `gaps` rendered on `/musica/`.
  - `data/rechazadas.yaml` (Manzia diary declined offers, cross-referencing numbered `data/clausulas.yaml` items) rendered on `/fechas/`.
  - `data/referencias.yaml` (venue/crew references) rendered on `/epk/`.
  - `data/cronicas.json` / `docs/cronicas-nocturnas.md` and `data/despachos.yaml` linked from the site footer.
- **Audio Player & Accessibility**:
  - Hand-rolled Web Audio pad + clip playback with language-synced state (`assets/js/main.js`).
  - Pulse clock (`beatInterval`) cleanup when switching from synthesized sets to audio clips.
  - Offscreen/closed player bar sets `inert` and `aria-hidden`, and returns focus to the originating track button when closed.
  - Verified by `node main.test.js` (11 test groups) and `./scripts/check-subpath.sh`.
- **CI/CD**: GitHub Actions Pages workflow (`.github/workflows/deploy.yml`) running `node main.test.js`, `hugo --gc --minify`, and `./scripts/check-subpath.sh`.

## Next

- **Custom Domain Cutover**: Point `hugo.toml` `baseURL` to `https://djbufalo.com/` and add `static/CNAME` once DNS resolves to GitHub Pages.
- **Sass Pipeline Migration**: Migrate `css.Sass` (`libsass`) in layouts/templates to `dartsass` before Hugo removes `libsass` support.
- **Audio Clips & Player Enhancements**: Wire real preview clips into `static/audio/`, add scrub/progress readout, and persist playback state across page navigations.
- **Bilingual & Spec Audits**: Add automated checks in `main.test.js` for missing `data-en` attributes and `*_es` / `*_en` YAML key parity.
