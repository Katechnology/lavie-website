/**
 * A camera move as a WebP frame sequence, scrubbed on a <canvas>.
 *
 * Seeking a <video> on every scroll tick is what made the transitions stutter (Safari
 * especially): each seek is async and decodes from the last keyframe. Frames don't wait.
 *
 * - Files arrive in coarse-to-fine order (every 16th frame, then 8th, 4th, 2nd, all), so a
 *   half-loaded move still scrubs end to end, just with fewer steps.
 * - Compressed files are kept as Blobs (~60 KB). Only a small window around the playhead is
 *   decoded to ImageBitmaps (off the main thread), so memory stays flat.
 * - Neighbouring frames are cross-blended, so 79 frames read as continuous motion.
 */

const FRAME_COUNT = 79;

type Tier = "1600" | "1024" | "m720";

const STRIDES = [16, 8, 4, 2, 1];
function loadOrder(n: number) {
  // both ends first: the first frame is where the move starts, the last is the next scene
  const seen = new Set<number>([0, n - 1]);
  const out: number[] = [0, n - 1];
  for (const s of STRIDES)
    for (let i = 0; i < n; i += s)
      if (!seen.has(i)) {
        seen.add(i);
        out.push(i);
      }
  return out;
}

/** Shared fetch queue: one transition at a time, nearest-first, a few requests in flight. */
const queue: { seq: FrameSequence; i: number }[] = [];
let inflight = 0;
const MAX_INFLIGHT = 6;
function pump() {
  while (inflight < MAX_INFLIGHT && queue.length) {
    const job = queue.shift()!;
    if (job.seq.blobs[job.i] || job.seq.dead || job.seq.fetching.has(job.i)) continue;
    inflight++;
    job.seq.fetching.add(job.i);
    fetch(job.seq.url(job.i), { signal: job.seq.abort.signal })
      .then((r) => (r.ok ? r.blob() : null))
      .then((b) => {
        if (b && !job.seq.dead && !job.seq.blobs[job.i]) {
          job.seq.blobs[job.i] = b;
          job.seq.loaded++;
          job.seq.onBlob(job.i);
        }
      })
      .catch(() => {})
      .finally(() => {
        job.seq.fetching.delete(job.i);
        inflight--;
        pump();
      });
  }
}

export class FrameSequence {
  readonly blobs: (Blob | null)[];
  readonly bmps: (ImageBitmap | null)[];
  private decoding = new Set<number>();
  /** frame files currently being fetched (so a re-queue never fetches twice) */
  readonly fetching = new Set<number>();
  /** cancels this move's in-flight downloads when it is thrown away (e.g. rotation) */
  readonly abort = new AbortController();
  /** bumped by release(): decodes that finish afterwards are dropped, not cached */
  private gen = 0;
  /** only the move on screen decodes a window around its playhead */
  active = false;
  /** the stage asked for this move's first/last frames to be ready */
  private warm = false;
  loaded = 0;
  dead = false;
  queued = false;
  /** playhead, in frames */
  private head = 0;
  /** bumps whenever a frame near the playhead becomes drawable */
  version = 0;

  constructor(
    private key: string,
    private tier: Tier,
    readonly n = FRAME_COUNT,
  ) {
    this.blobs = new Array(n).fill(null);
    this.bmps = new Array(n).fill(null);
  }

  url(i: number) {
    return `/seq/${this.key}/${this.tier}/${String(i + 1).padStart(3, "0")}.webp`;
  }

  /** queue every file; `urgent` jumps the line (the move the visitor is about to enter) */
  load(urgent = false) {
    if (this.queued && !urgent) return;
    const jobs = loadOrder(this.n)
      .filter((i) => !this.blobs[i] && !this.fetching.has(i))
      .map((i) => ({ seq: this as FrameSequence, i }));
    if (urgent) {
      // drop our older entries, then put ours first
      for (let k = queue.length - 1; k >= 0; k--) if (queue[k].seq === this) queue.splice(k, 1);
      queue.unshift(...jobs);
    } else queue.push(...jobs);
    this.queued = true;
    pump();
  }

  get complete() {
    return this.loaded >= this.n;
  }

  onBlob(i: number) {
    if (this.warm && this.pinned(i)) this.decode(i);
    if (this.active && Math.abs(i - this.head) <= WINDOW_AHEAD + 2) this.decodeAround(this.head);
  }

  /** keep only frames near the playhead decoded */
  decodeAround(head: number, dir = 1) {
    this.head = head;
    const c = Math.round(head);
    const lo = c - (dir >= 0 ? WINDOW_BEHIND : WINDOW_AHEAD);
    const hi = c + (dir >= 0 ? WINDOW_AHEAD : WINDOW_BEHIND);
    // nearest first
    for (let d = 0; d <= Math.max(c - lo, hi - c); d++) {
      for (const i of d ? [c + d * Math.sign(dir || 1), c - d * Math.sign(dir || 1)] : [c]) {
        if (i < lo || i > hi || i < 0 || i >= this.n) continue;
        this.decode(i);
      }
    }
    // let go of what fell out of the window
    for (let i = 0; i < this.n; i++) {
      if (this.bmps[i] && (i < lo - 4 || i > hi + 4) && !this.pinned(i)) {
        this.bmps[i]!.close();
        this.bmps[i] = null;
      }
    }
  }

  /** first and last frames stay decoded so entering/leaving the move is instant */
  private pinned(i: number) {
    return i < 2 || i > this.n - 3;
  }

  warmEnds() {
    this.warm = true;
    [0, 1, this.n - 2, this.n - 1].forEach((i) => this.decode(i));
  }

  private decode(i: number) {
    const b = this.blobs[i];
    if (!b || this.bmps[i] || this.decoding.has(i) || typeof createImageBitmap !== "function") return;
    if (this.decoding.size >= MAX_DECODES && !this.pinned(i)) return; // the next tick asks again
    this.decoding.add(i);
    const gen = this.gen;
    createImageBitmap(b)
      .then((bmp) => {
        this.decoding.delete(i);
        // scrolled on past it while it decoded: don't keep a frame we'd free next tick
        const stale = !this.pinned(i) && Math.abs(i - this.head) > WINDOW_AHEAD + 4;
        if (this.dead || gen !== this.gen || this.bmps[i] || stale) {
          bmp.close();
          // released and re-warmed while this was in flight: decode again under the new generation
          if (!this.dead && gen !== this.gen && this.warm && this.pinned(i)) this.decode(i);
          return;
        }
        this.bmps[i] = bmp;
        this.version++;
      })
      .catch(() => this.decoding.delete(i));
  }

  /** nearest decoded frame at or below / at or above `f` (searches outwards a little) */
  private nearest(f: number, step: 1 | -1) {
    for (let k = 0; k < 24; k++) {
      const i = f + k * step;
      if (i < 0 || i >= this.n) break;
      if (this.bmps[i]) return i;
    }
    return -1;
  }

  /**
   * Draw progress p∈[0,1]. Returns false when nothing drawable is near
   * (the caller keeps the painted stills up instead).
   */
  draw(ctx: CanvasRenderingContext2D, p: number) {
    const f = p * (this.n - 1);
    const a = this.nearest(Math.floor(f), -1);
    const b = this.nearest(Math.ceil(f), 1);
    if (a < 0 && b < 0) return false;
    const { width: w, height: h } = ctx.canvas;
    if (a < 0 || b < 0 || a === b) {
      ctx.globalAlpha = 1;
      ctx.drawImage(this.bmps[a < 0 ? b : a]!, 0, 0, w, h);
      return true;
    }
    const t = (f - a) / (b - a);
    ctx.globalAlpha = 1;
    ctx.drawImage(this.bmps[a]!, 0, 0, w, h);
    if (t > 0.02) {
      ctx.globalAlpha = t;
      ctx.drawImage(this.bmps[b]!, 0, 0, w, h);
      ctx.globalAlpha = 1;
    }
    return true;
  }

  /** frames decoded for this sequence come in at their native size */
  get size() {
    const bmp = this.bmps.find(Boolean);
    return bmp ? { w: bmp.width, h: bmp.height } : null;
  }

  /** free decoded frames (the compressed files stay, so coming back is quick) */
  release() {
    this.gen++;
    this.warm = false;
    this.active = false;
    this.bmps.forEach((b) => b?.close());
    this.bmps.fill(null);
  }

  dispose() {
    this.dead = true;
    this.abort.abort();
    this.release();
    for (let k = queue.length - 1; k >= 0; k--) if (queue[k].seq === this) queue.splice(k, 1);
  }
}

const WINDOW_AHEAD = 10;
const WINDOW_BEHIND = 5;
/** decodes in flight per move; the rest wait for the next frame */
const MAX_DECODES = 6;

type Conn = { saveData?: boolean; effectiveType?: string };

export function frameTier(orient: "d" | "m"): Tier {
  if (orient === "m") return "m720";
  const c = (navigator as Navigator & { connection?: Conn }).connection;
  if (c?.saveData || /(^|-)2g|3g/.test(c?.effectiveType ?? "")) return "1024";
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  return window.innerWidth * dpr >= 1500 ? "1600" : "1024";
}
