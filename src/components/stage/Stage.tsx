"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STAGE_SCENES, TRANSITIONS, detectOrient, loopSrc, poster, type Orient } from "@/lib/media";
import { FrameSequence, frameTier } from "@/lib/frames";
import { prefersReducedMotion, setStore } from "@/lib/store";

const FADE = 0.035; // portion of a transition spent cross-fading at each end

const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Writes a layer's opacity only when it changes, and takes hidden layers out of compositing. */
function makeOpacity() {
  const last = new WeakMap<HTMLElement, number>();
  return (el: HTMLElement | null | undefined, o: number) => {
    if (!el) return;
    const v = Math.round(o * 1000) / 1000;
    if (last.get(el) === v) return;
    last.set(el, v);
    el.style.opacity = String(v);
    el.style.visibility = v <= 0 ? "hidden" : "visible";
  };
}

/**
 * The fixed, painted "camera". Each scene has a still + an ambient loop; between
 * scenes a camera move (a frame sequence on a canvas) is scrubbed by scroll position
 * ([data-transition="k"]).
 */
/** Rebuilds the stage with the 9:16 or 16:9 painted set when the screen shape flips. */
export default function StageRoot() {
  // decided on the client only (the loader covers this first frame)
  const [orient, setOrient] = useState<Orient | null>(null);
  useEffect(() => {
    let t = 0;
    const check = () => setOrient(detectOrient());
    const onResize = () => {
      clearTimeout(t);
      t = window.setTimeout(check, 200);
    };
    check();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  if (!orient) return <div aria-hidden className="fixed inset-0 z-0 bg-[#8fbfee]" />;
  return <Stage key={orient} orient={orient} />;
}

function Stage({ orient }: { orient: Orient }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRefs = useRef<(HTMLImageElement | null)[]>([]);
  const loopRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = prefersReducedMotion();
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const setO = makeOpacity();

    let lastBase = -1;
    let raf = 0;

    /* ── camera moves as frame sequences ──────────────────────── */
    const tier = frameTier(orient);
    const seqs = reduced ? [] : TRANSITIONS.map((t) => new FrameSequence(t, tier));
    const canvas = canvasRef.current!;
    const [cw, ch] = tier === "m720" ? [720, 1280] : tier === "1600" ? [1600, 900] : [1024, 576];
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d", { alpha: false })!;
    ctx.imageSmoothingQuality = "high";
    let drawn = { k: -1, p: -1, v: -1 };
    let lastP = 0;

    /* ── lazy loop sources ────────────────────────────────────── */
    const ensureLoop = (i: number) => {
      const v = loopRefs.current[i];
      const key = STAGE_SCENES[i]?.loop;
      if (!v || !key || reduced || v.dataset.src) return;
      v.dataset.src = loopSrc(key, orient);
      v.src = v.dataset.src;
      v.load();
      if (i === lastBase) v.play().catch(() => {});
    };

    // decode every still up front so a scene never flashes empty on first show
    posterRefs.current.forEach((img) => img?.decode?.().catch(() => {}));

    /* ── hero readiness for the loader ────────────────────────── */
    let announced = false;
    const announce = () => {
      if (announced) return;
      announced = true;
      window.dispatchEvent(new Event("lavie:stage-ready"));
      // then fetch every camera move in journey order, coarse frames first
      seqs.forEach((s) => s.load());
    };
    const heroPoster = posterRefs.current[0];
    const heroLoop = loopRefs.current[0];
    ensureLoop(0);
    seqs[0]?.load(true);
    const posterReady = new Promise<void>((r) => {
      if (!heroPoster || heroPoster.complete) r();
      else heroPoster.addEventListener("load", () => r(), { once: true });
    });
    const loopReady = new Promise<void>((r) => {
      if (reduced || !heroLoop) return r();
      if (heroLoop.readyState >= 3) return r();
      heroLoop.addEventListener("canplay", () => r(), { once: true });
      setTimeout(r, 3500);
    });
    Promise.all([posterReady, loopReady]).then(announce);
    const failSafe = setTimeout(announce, 6000);

    /* ── scroll triggers for each camera move ─────────────────── */
    const triggers = TRANSITIONS.map((_, k) => {
      const el = document.querySelector(`[data-transition="${k}"]`);
      if (!el) return null;
      return ScrollTrigger.create({ trigger: el, start: "top 80%", end: "bottom 20%" });
    });

    /* ── pointer parallax ─────────────────────────────────────── */
    const ptr = { tx: 0, ty: 0, x: 0, y: 0, lx: 99, ly: 99 };
    const onMove = (e: PointerEvent) => {
      ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (finePointer && !reduced) window.addEventListener("pointermove", onMove, { passive: true });

    /* ── render loop ──────────────────────────────────────────── */
    const tick = () => {
      raf = requestAnimationFrame(tick);

      let k = -1;
      let p = 0;
      let done = 0;
      for (let i = 0; i < triggers.length; i++) {
        const pr = triggers[i]?.progress ?? 0;
        if (pr >= 1) done++;
        if (k < 0 && pr > 0 && pr < 1) {
          k = i;
          p = pr;
        }
      }
      const base = k >= 0 ? (p < 0.5 ? k : k + 1) : done;

      if (base !== lastBase) {
        // restart the incoming loop so its first frame matches the camera move's last frame
        loopRefs.current.forEach((v, i) => {
          if (!v) return;
          if (i === base) {
            if (v.dataset.src) {
              try {
                v.currentTime = 0;
              } catch {}
              v.play().catch(() => {});
            }
          } else v.pause();
        });
        lastBase = base;
        setStore({ scene: base });
        // the moves on either side of this scene are next: fetch them first, keep their ends decoded
        seqs.forEach((s, i) => {
          const near = i === base || i === base - 1;
          if (near) {
            s.load(true);
            s.warmEnds();
          } else if (i !== k) s.release();
        });
        ensureLoop(base);
        ensureLoop(Math.min(base + 1, STAGE_SCENES.length - 1));
      }

      // draw the camera move
      let canvasO = 0;
      let seqShown = false;
      const seq = k >= 0 ? seqs[k] : undefined;
      if (seq) {
        const f = p * (seq.n - 1);
        seq.decodeAround(f, p >= lastP ? 1 : -1);
        lastP = p;
        if (drawn.k !== k || Math.abs(drawn.p - p) > 1e-4 || drawn.v !== seq.version) {
          seqShown = seq.draw(ctx, p);
          if (seqShown) drawn = { k, p, v: seq.version };
          else drawn.k = -1;
        } else seqShown = true;
        if (seqShown) canvasO = clamp01(Math.min(p / FADE, (1 - p) / FADE));
      } else drawn.k = -1;
      setO(canvas, canvasO);

      // stills + loops
      STAGE_SCENES.forEach((_, i) => {
        let o = i === base ? 1 : 0;
        // no frames yet → crossfade the stills instead
        if (k >= 0 && !seqShown) {
          if (i === k) o = 1;
          else if (i === k + 1) o = smooth(clamp01((p - 0.2) / 0.6));
          else o = 0;
        }
        // while the canvas fully covers the stage, nothing under it needs compositing
        if (canvasO >= 1) o = 0;
        setO(posterRefs.current[i], o);
        const v = loopRefs.current[i];
        if (v) setO(v, o > 0 && v.readyState >= 2 && !v.paused ? o : 0);
      });

      // parallax
      if (finePointer && !reduced && innerRef.current) {
        ptr.x += (ptr.tx - ptr.x) * 0.06;
        ptr.y += (ptr.ty - ptr.y) * 0.06;
        if (Math.abs(ptr.x - ptr.lx) > 0.0005 || Math.abs(ptr.y - ptr.ly) > 0.0005) {
          ptr.lx = ptr.x;
          ptr.ly = ptr.y;
          innerRef.current.style.transform = `translate3d(${(-ptr.x * 12).toFixed(2)}px, ${(-ptr.y * 8).toFixed(2)}px, 0) scale(1.04)`;
        }
      }
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      const v = loopRefs.current[lastBase];
      if (!v) return;
      if (document.hidden) v.pause();
      else if (v.dataset.src) v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failSafe);
      triggers.forEach((t) => t?.kill());
      seqs.forEach((s) => s.dispose());
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [orient]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#8fbfee]">
      <div ref={innerRef} className="absolute inset-[-2%] will-change-transform" style={{ transform: "scale(1.04)" }}>
        {STAGE_SCENES.map((s, i) => (
          <div key={s.key} className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={(el) => {
                posterRefs.current[i] = el;
              }}
              src={poster(s.key, orient)}
              alt=""
              fetchPriority={i === 0 ? "high" : "low"}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
            />
            {s.loop && (
              <video
                ref={(el) => {
                  loopRefs.current[i] = el;
                }}
                muted
                loop
                playsInline
                preload="none"
                disablePictureInPicture
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: 0, visibility: "hidden" }}
              />
            )}
          </div>
        ))}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0, visibility: "hidden" }}
        />
      </div>
      {/* soft painterly vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgba(10,12,20,0.28)_100%)]" />
    </div>
  );
}
