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

Between scenes, AI-generated camera moves are **scrubbed by scroll** as WebP frame sequences on a
canvas (`public/seq/t12…t45`, `src/lib/frames.ts`, `src/components/stage/Stage.tsx`). Each move is
fetched only when the visitor reaches the scene before it. Phones in portrait get their own 9:16
painted set (`*-m-*`) and 720p loops.

## Editing content

All copy lives in **`src/content/site.ts`** (Vietnamese).

- `site.credentials` holds confirmed facts only (JLPT N1, confirmed by the owner). Add years teaching
  when known. `site.testimonials` stays empty until there are real student quotes; the block is hidden
  while empty.
- Phone / Zalo: `site.contact`.
- Site URL (canonical, Open Graph, sitemap, robots, JSON-LD): on Vercel the production `*.vercel.app`
  address is used automatically. Set `NEXT_PUBLIC_SITE_URL` once a custom domain exists.

## Deploy

Vercel project `lavie-website`, connected to this GitHub repo: **every push to `main` deploys to
https://lavie-website-lake.vercel.app** (other branches get preview URLs). Next.js preset, `pnpm build`. Media under `/seq`, `/video`, `/scenes`, `/img` is cached for a
week (`next.config.ts`): **when an asset's bytes change, give it a new file or folder name.**

## Art pipeline (`art/`)

- `art/prompts/*.md` — prompts for every painting (16:9 `k*`, 9:16 `m*`, props `p-*`).
- `art/gen.sh <prompt.md> <out.png> <size> [ref…]` — renders a painting with Codex's image tool.
- Videos: fal `minimax/h3-max-turbo/image-to-video` at 1080P — loops use the same first/last
  frame, transitions use scene A → scene B. Job ids in `art/video/jobs.txt`.
- `art/encode.sh`, `art/encode-m.sh` — web encodes of the ambient loops (VP9 + H.264).
- `art/frames.sh` — cuts the camera moves into the WebP frame sequences in `public/seq`.

## Stack

Next.js 16 (static) · Tailwind v4 · GSAP ScrollTrigger · Lenis · React Bits (SplitText, ScrollReveal,
ClickSpark, TiltedCard, VariableProximity, Noise) · Roboto Serif / Roboto Mono / Shippori Mincho.
