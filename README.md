# Lavie 日本語 — landing page

A scroll-driven, hand-painted journey for Lavie, a Japanese tutor in Huế (N5 → N2).
Inspired by the cinematic, serif-led style of lettra.dev.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # static production build
```

## The journey

| Scene | Section id | Background |
|---|---|---|
| Đồi anh đào — sakura hill above the Perfume River | `#doi-anh-dao` | loop |
| Trời xanh — petal "Từ N5 đến N2" + four tanzaku levels | `#lo-trinh` | loop |
| Hồ sen — interactive kana (tap to hear) | `#thu-chu` | loop |
| Bờ đá — Lavie's letter + polaroid | `#ve-lavie` | still |
| Phòng học đêm — formats, trial steps, FAQ, CTA | `#lop-hoc`, `#lien-he` | loop |

Between scenes, AI-generated camera moves (`public/video/t12…t45`) are **scrubbed by scroll**
(`src/components/stage/Stage.tsx`). Phones in portrait get their own 9:16 painted set (`*-m-*`).

## Editing content

All copy lives in **`src/content/site.ts`** (Vietnamese).

- `site.credentials` and `site.testimonials` are empty on purpose: the page hides those blocks until
  real facts are filled in (JLPT certificate, years teaching, real student quotes).
- Phone / Zalo: `site.contact`.
- Set `NEXT_PUBLIC_SITE_URL` to the real domain for correct Open Graph links.

## Art pipeline (`art/`)

- `art/prompts/*.md` — prompts for every painting (16:9 `k*`, 9:16 `m*`, props `p-*`).
- `art/gen.sh <prompt.md> <out.png> <size> [ref…]` — renders a painting with Codex's image tool.
- Videos: fal `minimax/h3-max-turbo/image-to-video` at 1080P — loops use the same first/last
  frame, transitions use scene A → scene B. Job ids in `art/video/jobs.txt`.
- `art/encode.sh`, `art/encode-m.sh` — web encodes (scrub-friendly GOP 4 for transitions, VP9 + H.264 loops).

## Stack

Next.js 16 (static) · Tailwind v4 · GSAP ScrollTrigger · Lenis · React Bits (SplitText, ScrollReveal,
ClickSpark, TiltedCard, VariableProximity, Noise) · Roboto Serif / Roboto Mono / Shippori Mincho.
