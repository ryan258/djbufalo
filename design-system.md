## DESIGN SYSTEM — Locked (Manzia Correction)

**Typography:**
* **Primary Display:** Heavy condensed grotesk (*Barlow Condensed* / *Archivo Black* / *Druk* style) for oversized, blunt headlines (`DJ BUFALO`, `THE MOST CONSISTENT CLOSER IN CHACARITA.`).
* **Secondary Body:** Neutral contemporary grotesk (*Archivo* / *Neue Montreal*) for readable, unpretentious body copy.
* **Utility / Metadata:** Monospace (*IBM Plex Mono*) for timestamps, coordinates, BPM, catalog identifiers, deadpan rider items, and technical copy.

**Color Palette:**
* **Obsidian `#0B0B0A`:** Primary background.
* **Bone `#F1EDE4`:** Primary type and light surfaces.
* **Bufalo Amber `#E8A33A`:** Signature warm accent (status markers, links, key timestamps).
* **Afterhours Violet `#7668FF`:** Rare secondary accent (restricted to 1 intervention per major viewport/section, unexpected handwritten stickers).
* **Charcoal `#1A1917`:** Structural panels, card containers, and tonal separation.

**Accent Ratio:** Roughly **85% neutral / 12% amber / 3% violet**. Violet is strictly rationed so it feels discovered rather than decorative.

**Layout Rules:**
* High negative space with one dominant hierarchy per composition.
* Central content system scaled with authority within the viewport.
* Metadata stays small and peripheral, but remains readable (desktop minimum 11–12 px, 13–14 px for readable copy, never below 10 px).
* Controlled asymmetry: grid-based structure where only the buffalo photography, violet handwritten interventions, and occasional archival fragments break alignment.

**Visual Style:** Premium archival club documentation; precise rather than distressed. No gratuitous grime, fake photocopy noise, or club clichés.

**Imagery Direction:** Physical Bufalo photographed deadpan within real Buenos Aires / nightlife environments (backstage, in taxis, sitting on flight cases, staring across empty dancefloors). The mascot behaves as though his presence requires no explanation.

---

### Brand Architecture Lock

* **DJ BUFALO:** Artist, character, cultural universe. Leads all creative presentation.
* **MANZIA BOOKINGS:** Representation, tour dates, and administrative infrastructure. Signs the administrative layer.
* **Standardized Booking Language:**
  * `MANZIA BOOKINGS`
  * `FECHAS / CONTACTO` (ES) / `BOOKINGS / CONTACT` (EN)
  * `booking@djbufalo.com`

---

## NUMERIC LAYOUT SYSTEM — Locked

* **Desktop Canvas Reference:** 1440 px
* **Primary Content Max-Width:** 1080 px (range: 1060–1120 px)
* **Outer Canvas Margin:** minimum 72 px
* **Section Vertical Spacing:** 100–120 px
* **Major Module Spacing:** 56–64 px
* **Internal Component Spacing:** 24 / 32 / 48 px
* **Grid:** 12 columns, 24 px gutter

**Typography Scales:**
* **Display H1:** 88–104 px (compact leading ~0.88)
* **Section H2 (Condensed):** 42–52 px (leading ~0.92)
* **Card / Stat Headline:** 26–30 px
* **Body Text:** 15–17 px (line-height 1.65, max line length 60–65 characters)
* **Metadata & Secondary Labels:** 11–13 px
* **Microtype Floor:** Absolute minimum 10 px

---

## ECOSYSTEM SPECIFICATIONS

* **Master Visual Reference:** the live Hugo site in this repo (`layouts/` + `assets/sass/`).
  The original comps live in `mocks/`, which is gitignored (~10 MB of PNGs) — treat them as
  local-only history, not as the source of truth.
* **Downstream Canvases to Rebuild:**
  1. Event Poster (100×70cm / A1)
  2. Instagram Dossier Grid (1:1 / 4:5)
  3. Record Artwork (12" sleeve + center label)
  4. Merchandise (Heavyweight boxy tee + technical accessories)
