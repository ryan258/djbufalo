# DJ BUFALO

> **Never Rushes The Drop / Nunca Apura La Bajada**

Bilingual (`es-AR` / `en`) Hugo static site for **DJ Bufalo** — selector, producer, and nocturnal archive from Chacarita, Buenos Aires.

## Architecture

- **Generator**: Hugo Extended (pinned in CI at `0.165.0`; `hugo.toml` sets `baseURL = 'https://ryan258.github.io/djbufalo/'` and disables taxonomy/term kinds).
- **Bilingual Copy**: Content defaults to `es-AR`; `assets/js/main.js` toggles `data-i18n` (`data-es` / `data-en`) across all UI copy, persists `djbufalo_lang` in `localStorage`, and updates `<html lang>`.
- **Data-Driven Pages** (`data/` + `content/` + `layouts/`):
  - `/` — Landing overview (`layouts/index.html`)
  - `/fechas/` — Tour dates (`data/fechas.yaml`) and declined offers (`data/rechazadas.yaml`, referencing `data/clausulas.yaml`)
  - `/sets/` — Set archive (`data/sets.yaml`, including per-set `tracklist` entries)
  - `/musica/` — Discography (`data/releases.yaml`, including catalog `gaps`)
  - `/bio/` — History & press (`data/historia.yaml`, `data/prensa.yaml`)
  - `/merch/` — Capsule (`data/merch.yaml`)
  - `/epk/` — Electronic Press Kit (`data/specs.yaml`, `data/rider.yaml`, `data/clausulas.yaml`, `data/referencias.yaml`)
  - `/cronicas/` — Six-part nocturnal microfiction archive (`data/cronicas.json`, sourced from `docs/cronicas-nocturnas.md`)
  - `/despachos/` — Past dispatches (`data/despachos.yaml`)
- **Audio Player** (`assets/js/main.js`): Hand-rolled Web Audio synthesizer pad + optional audio clip playback, synced with the hero trigger and set rows, managing `inert` / `aria-hidden` and focus return when closed.
- **Design System**: Locked tokens and archival editorial rules in [design-system.md](design-system.md) and [style-guide.md](style-guide.md), compiled from `assets/sass/`.

## Verification & Local Development

Run the JS self-check, build with Hugo, and verify subpath-safe asset URLs (matching `.github/workflows/deploy.yml`):

```bash
node main.test.js
hugo --gc --minify
./scripts/check-subpath.sh
```

For local live preview:

```bash
hugo server -D
```

## Documentation

- [design-system.md](design-system.md) — Color palette, typography, spacing, and token definitions
- [style-guide.md](style-guide.md) — Editorial voice, mascot rules, and component guidelines
- [roadmap.md](roadmap.md) — Current status and planned improvements
- [docs/cronicas-nocturnas.md](docs/cronicas-nocturnas.md) — Bilingual microfiction source (`BUF-ARCHIVO 01–06`)
- [docs/101-prompts-to-use-this-for-fun-and-profit.md](docs/101-prompts-to-use-this-for-fun-and-profit.md) — Maintenance & extension prompts (EN)
- [docs/101-prompts-para-la-joda-y-la-guita.md](docs/101-prompts-para-la-joda-y-la-guita.md) — Maintenance & extension prompts (ES)
