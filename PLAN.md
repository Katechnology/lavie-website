# Lavie — 日本語 landing page · build plan

Reference: lettra.dev (JOYCO). What makes it work:
- A **single continuous camera journey** through hand-painted anime-film scenes, driven by scroll
  (tree on hill → leaves in sky → koi pond → paper note → night room with CRTs → footer).
- **One serif voice** (Roboto Serif, big, tight tracking, white/ink) + **tiny mono labels** (Roboto Mono).
- **Pill UI**: top-centre glass/ink pills (`Lettra` `Docs` `GitHub` `◐`), a persistent bottom pill
  holding the one action (`npx skills add …` + copy), "Scroll Down" pill, left vertical scene progress ticks.
- **Loader** with a stamped flower mark + rotating whimsical copy ("Planting Seeds…", "Opening the Window…").
- **Footer**: near-black, giant italic serif wordmark, 4 mono-labelled link columns.
- Text lives *inside* the scene (occluded by the tree, written on a leaf, on the paper).

## Concept — "Một cây anh đào bên dòng Hương"
A cherry tree by the Perfume River: Japan meets Huế, which is literally what Lavie does.
The scroll journey = the learner's journey N5 → N2. Copy in Vietnamese with Japanese accents.

| # | Scene (keyframe) | Camera move into it | Content on it |
|---|---|---|---|
| 0 | Loader — hanko-stamp sakura mark | — | "Đang mài mực…", "Đang pha trà…", "Đang mở cửa sổ…" |
| 1 | **Đồi anh đào** — sakura on hill, Perfume River + Thiên Mụ far below (ambient loop) | — | H1 "Tiếng Nhật, nở hoa." · sub · CTA pills |
| 2 | **Trời xanh** — up into the sky, petals swirling | tilt up from hill (scroll-scrubbed video) | Big petal carrying "Từ N5 đến N2" → 4 level stations |
| 3 | **Hồ sen** — top-down Huế lotus pond, koi, petals (ambient loop) | swoop down into the water | "Chạm vào là hiểu." interactive kana playground |
| 4 | **Bờ đá** — pond edge, stones, petals, washi paper | pan along the bank | "Thư từ Lavie" — letter + polaroid of her (real photo) |
| 5 | **Phòng học đêm** — lamp-lit study, window to Trường Tiền bridge at night (ambient loop) | dusk falls, push into window | Formats (1-1 online, 1-1 Huế, nhóm nhỏ, luyện thi JLPT) · how it works · FAQ · "Đến lượt bạn." CTA |
| 6 | Footer | — | giant italic "Lavie", columns: Khoá học · Cảnh · Liên hệ · Huế |

## Persistent UI
- Top pills: `[avatar] Lavie` · `Khoá học` · `Liên hệ` · sound `◐` (ambient wind/water, off by default).
- Bottom pill: `☎ 0917 989 323` + copy button + `Zalo ↗` (the lettra `npx` pill equivalent).
- Left progress ticks (6 scenes), click to jump.
- `prefers-reduced-motion`: no scrubbing, stills + fades; text readable everywhere.

## Art pipeline
- Keyframes: Codex built-in image gen (gpt-image), 2048×1152, one shared style bible (`art/prompts/style.md`).
- Video: fal `minimax/h3-max-turbo/image-to-video` @ 1080P.
  - Loops: first = last = same keyframe, "fixed shot" ambient motion (10 s).
  - Transitions: first = scene A, last = scene B, camera move (6 s), scrubbed by scroll.
- Encoding: loops → H.264/WebM; transitions → all-intra H.264 (scrub-friendly) or frame sequence.
- Mobile: reframed `object-position` per scene; lighter 720p encodes.

## Stack
Next.js (App Router, static) · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Lenis · React Bits (SplitText etc.) ·
fonts: Roboto Serif (VI), Roboto Mono, Shippori Mincho (JP glyphs).

## Facts (from client)
Lavie · Japanese tutor N5–N2 · Huế City, Vietnam · 0917 989 323 · Zalo same number ·
formats: 1-1 online, 1-1 in Huế, small group, JLPT prep · no prices ("liên hệ học phí", free trial lesson).
Placeholders (marked `TODO(Lavie)` in `src/content/site.ts`): JLPT certificate, years teaching, student results, testimonials.
