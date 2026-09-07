# 101 Prompts To Use This For Fun And Profit

What "this" is: the DJ Bufalo site — a Hugo build with bilingual ES/EN copy driven by
`data-i18n`, YAML-driven content in `data/`, a locked design system (`design-system.md`,
`style-guide.md`), a hand-rolled audio player in `assets/js/main.js`, and a GitHub Pages
deploy that lives under a subpath and is gated by `node main.test.js` plus
`./scripts/check-subpath.sh`.

How to use: paste one into Claude Code from the repo root. Replace anything in `<angle
brackets>`. They are written to be run one at a time — a prompt that touches the design
system will go better if you have not just asked for four other things.

---

## A. Content & data (1–12)

1. Add a date to `data/fechas.yaml` for `<venue>` on `<date>`, plus a matching `content/fechas/<slug>.md` that follows the shape of `content/fechas/galpon-12.md`.
2. Mark the `<slug>` date as sold out and confirm the AGOTADO / SOLD OUT badge renders in both `layouts/partials/fechas.html` and `layouts/fechas/list.html`.
3. Split `data/fechas.yaml` into upcoming and past at render time, and put past shows in a collapsed section below the upcoming ones.
4. Add a set to `data/sets.yaml` with id, bilingual title, duration and BPM, and wire its preview clip into `static/audio/`.
5. Sort sets by date descending at render time instead of relying on file order in the YAML.
6. Add a `tracklist` field to each set in `data/sets.yaml` and render it as a collapsible list on `layouts/sets/single.html`.
7. Add a release to `data/releases.yaml` with catalog number, label and streaming links, keeping the mono metadata treatment.
8. Add `stock` to `data/merch.yaml` and render a distinct state for items at zero.
9. Generate a printable one-page rider from `data/rider.yaml` with an `@media print` stylesheet.
10. Audit every file in `data/` for missing bilingual pairs — any `*_es` key without its `*_en` — and report the gaps by file and line.
11. Add `data/prensa.yaml` with press quotes and render a pull-quote strip on the bio page.
12. Write a Hugo shortcode for a deadpan metadata line (BPM / duration / coordinates) I can drop into any content markdown.

## B. Bilingual (13–20)

13. Find every hardcoded Spanish string in `layouts/` that has no `data-i18n` counterpart and list them by file and line.
14. Add Portuguese as a third language without turning the toggle into a dropdown — three is still a toggle.
15. Persist the language choice in `localStorage` and apply it before first paint so English readers never see a flash of Spanish.
16. Verify `<html lang>` actually changes on toggle, and that a screen reader gets the right language for each block.
17. Move i18n strings out of inline attributes into `i18n/es.toml` and `i18n/en.toml`, using Hugo's `i18n` function wherever the string is known at build time.
18. Add `hreflang` alternates for the ES and EN versions of every page.
19. Flag every `title_en` that is byte-identical to its `title_es` and tell me which are proper nouns and which are just untranslated.
20. Add a check to `main.test.js` that fails if any `data-i18n` element is missing its English text.

## C. Design system (21–30)

21. Audit `assets/sass/` against `design-system.md` and report every color literal that is not one of the five locked tokens.
22. Measure actual amber and violet coverage across the rendered homepage and tell me whether it holds the 85 / 12 / 3 ratio.
23. Find every violet intervention on the site and flag any viewport section carrying more than one.
24. Confirm no rendered text drops below the 10px floor and that body copy holds 13–14px minimum.
25. Convert the remaining hardcoded spacing values in `_layout.scss` to the numeric layout scale in `design-system.md`.
26. Build a `/styleguide` page rendering every token, type step and component in one place, excluded from the sitemap.
27. Review mascot usage across all pages against the "presence requires no explanation" rule in `style-guide.md` and flag anything that over-explains him.
28. The site is dark by design — confirm nothing breaks when a user forces `prefers-color-scheme: light`.
29. Replace any shadow or gradient that reads as generic club flyer with the flat archival treatment the style guide calls for.
30. Diff the live rendered typography against the desktop baseline table in `style-guide.md` and report the drift.

## D. Audio player (31–40)

31. Add a global keyboard shortcut: space toggles the current track when focus is not in a form field.
32. Add a scrub bar with elapsed / remaining readout in the mono utility font.
33. Persist the playing set and its position across page navigations using `sessionStorage`.
34. Add prev/next navigation to the player bar that walks `data/sets.yaml` in render order.
35. Collapse the player bar to a thin strip on scroll down and expand on scroll up, with no layout shift.
36. Generate a waveform preview at build time from the WAV files in `static/audio/` and render it behind the scrub bar.
37. Preload only the first preview clip; lazy-load the rest on first interaction.
38. Audit the synth fallback path — confirm it never plays over a real clip and stops cleanly on pause.
39. Add a volume control that remembers its setting and respects OS autoplay and reduced-motion policies.
40. Add a check that the play button's `aria-label` flips between play and pause with the track title interpolated in both languages.

## E. Performance & assets (41–50)

41. Generate responsive `srcset` variants for every image in `static/images/` and update the templates to use them.
42. Convert the set thumbnails to AVIF with WebP fallback and report the byte savings.
43. Report total homepage transfer size and rank the five heaviest assets.
44. Add `width` and `height` to every `<img>` so nothing shifts during load.
45. Inline the critical CSS for the hero and defer the rest.
46. Audit `main.js` for anything running before first paint and move what can be deferred.
47. Fingerprint and gzip every asset at build time, and confirm fingerprints actually change when the source does.
48. Find any font file being loaded that no rendered page actually uses.
49. Find any image being downscaled more than 2x by the browser — that is wasted bytes.
50. Fail the build if any single asset exceeds 200KB without an explicit allowlist entry.

## F. SEO & social (51–59)

51. Generate a `sitemap.xml` that excludes the EPK page and any draft content.
52. Add JSON-LD `MusicGroup` and `Event` structured data driven by `data/fechas.yaml`.
53. Write per-page `description` front matter for every page in `content/`, in Spanish, matching the `es-AR` locale.
54. Verify the Open Graph image is 1200x630 and that nothing important sits inside the crop margins.
55. Add Twitter card meta and validate the tag set against the current spec.
56. Add a `canonical` link to every page that respects the GitHub Pages subpath.
57. Generate an RSS feed for the fechas section only.
58. Check that `static/robots.txt` does not block anything social preview crawlers need.
59. Audit every outbound link for `rel="noopener"` and correct target behavior.

## G. Accessibility (60–67)

60. Contrast-check every text/background pair in the rendered site against WCAG AA and list failures with measured ratios.
61. Tab through the whole site and report any focus trap, invisible focus ring, or wrong tab order.
62. Verify the skip link moves focus, not just scroll position.
63. Confirm every interactive element is operable by keyboard alone — play buttons and language toggle included.
64. Add `prefers-reduced-motion` handling to every animation and transition in `_components.scss`.
65. Review all `aria-live` regions for over-announcement; the player should not chatter on every tick.
66. Give every image alt text describing what it shows, not what it is for, and mark decorative images empty.
67. Load the site with images disabled and confirm the content still reads.

## H. Build, CI, deploy (68–77)

68. Add a link checker to CI that fails on any broken internal link in `public/`.
69. Extend `scripts/check-subpath.sh` to catch subpath violations inside inline `<style>` blocks and JS string literals.
70. Add an HTML validation step to `.github/workflows/deploy.yml`.
71. Cache the Hugo binary and `resources/` in CI and report the build time before and after.
72. Add a preview deploy for pull requests under a separate path.
73. Fail the build if `hugo` emits any warning at all.
74. Set up the custom domain: add `static/CNAME`, flip `baseURL` in `hugo.toml`, and tell me exactly which DNS records to create.
75. Verify every file in `static/audio/` is actually referenced by a data file, and flag orphans.
76. Write a pre-commit hook that runs `node main.test.js` and `./scripts/check-subpath.sh`.
77. Measure the cold build time and tell me what is actually slow before optimizing anything.

## I. Reselling the template (78–89)

78. Extract everything artist-specific into `data/` and `content/` so this becomes a reusable artist-site template with zero hardcoded "Bufalo" left in `layouts/`.
79. Write a `SETUP.md` that takes a new artist from clone to deployed site in under thirty minutes.
80. Create a second skin — color tokens and type pairing only — that proves the layout survives a full rebrand.
81. Build a one-command scaffold that swaps brand name, palette, fonts and images from a single config file.
82. Write the sales page copy for this as a paid template, positioned against Squarespace and Bandcamp pages.
83. Add a license file and a plain statement of what a buyer may and may not resell.
84. Strip the site to a demo build with placeholder content I can host as a live preview.
85. Make a venue version instead of an artist version: rooms, resident nights, capacity, recurring-event data model.
86. Make a label version: roster, catalog, distribution links, per-release pages.
87. Write a five-email onboarding sequence for buyers of the template.
88. Build a variant that swaps the Hugo data files for a headless CMS so a non-technical artist can update dates.
89. Cost out hosting, domain and email for a client running this, and give me a monthly number to quote.

## J. Booking, merch, newsletter (90–96)

90. Replace the localStorage newsletter stub with a real provider integration, keeping the bilingual status messages and a no-JS fallback.
91. Add a booking inquiry form posting to a form service, with date, city, budget range and set length.
92. Instrument the EPK download buttons so I can see which assets promoters actually take.
93. Build an unlisted EPK variant behind a passcode for exclusive materials.
94. Wire merch items to real checkout links, with an out-of-stock state that still captures interest.
95. Add a "request this set" flow on each set page that emails booking with the set id prefilled.
96. Write the EPK copy in the deadpan Manzia register, for a promoter who has never heard of him.

## K. Fun (97–101)

97. Add a hidden konami-code easter egg that plays a four-second kick pattern and drops a violet sticker on screen.
98. Generate a fake but internally consistent twenty-year discography in `data/releases.yaml` with catalog numbers following one scheme.
99. Add a "current BPM" readout in the footer that drifts slowly between 124 and 127 all day. Mono font. No explanation.
100. Build a set-length leaderboard ranking every set in `data/sets.yaml` by duration, and label the longest one NEVER RUSHED.
101. Make the 404 line change with the hour in Buenos Aires — polite before midnight, unbothered after.
