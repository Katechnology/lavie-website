"use client";

import { useEffect, useRef } from "react";
import { getStore, prefersReducedMotion } from "@/lib/store";

/**
 * Click anywhere and the scene answers, in its own material:
 *
 *   hill · sky · footer  a sakura flower blooms under the cursor, then bursts into petals
 *   lotus pond           rings spread across the water, a petal settles on the surface
 *   stone bank           a drop of sumi ink blooms and spatters (on the washi letter, too)
 *   night study          fireflies lift off and drift up toward the lamp
 *
 * Hold the button and a ring charges; let go for a bigger bloom. Drag to trail petals.
 * Moving the cursor through drifting petals blows them aside.
 *
 * One fixed canvas, one rAF loop that only runs while something is alive; the canvas is
 * taken out of compositing when idle, so it costs nothing while you scroll.
 */

type Kind = "petal" | "flower" | "ring" | "glow" | "ink" | "dot" | "charge";
type P = {
  kind: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  rot: number;
  vr: number;
  flip: number;
  vflip: number;
  sway: number;
  phase: number;
  alpha: number;
  sprite?: HTMLCanvasElement;
  color?: string;
  width?: number;
  delay: number;
  drag: number;
  gravity: number;
  /** water petals: drift on the surface, don't fall */
  float?: boolean;
};

type Theme = "sakura" | "pond" | "ink" | "night";

const MAX = 520;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(xs: T[]) => xs[(Math.random() * xs.length) | 0];
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

/* ─────────────────────── sprites (painted once) ─────────────────────── */

function petalPath(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // a sakura petal: rounded body, the little notch at the tip
  ctx.beginPath();
  ctx.moveTo(0, h * 0.5);
  ctx.bezierCurveTo(-w * 0.62, h * 0.22, -w * 0.5, -h * 0.42, -w * 0.13, -h * 0.5);
  ctx.quadraticCurveTo(-w * 0.04, -h * 0.4, 0, -h * 0.34);
  ctx.quadraticCurveTo(w * 0.04, -h * 0.4, w * 0.13, -h * 0.5);
  ctx.bezierCurveTo(w * 0.5, -h * 0.42, w * 0.62, h * 0.22, 0, h * 0.5);
  ctx.closePath();
}

function makePetal(base: string, tip: string, edge: string) {
  const H = 72;
  const W = 52;
  const c = document.createElement("canvas");
  c.width = W + 8;
  c.height = H + 8;
  const ctx = c.getContext("2d")!;
  ctx.translate(c.width / 2, c.height / 2);
  const g = ctx.createLinearGradient(0, H / 2, 0, -H / 2);
  g.addColorStop(0, base);
  g.addColorStop(0.55, tip);
  g.addColorStop(1, edge);
  petalPath(ctx, W, H);
  ctx.fillStyle = g;
  ctx.fill();
  // a vein and a soft sheen
  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = base;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, H * 0.46);
  ctx.quadraticCurveTo(-2, 0, 0, -H * 0.3);
  ctx.stroke();
  ctx.globalAlpha = 0.35;
  const s = ctx.createRadialGradient(-W * 0.15, -H * 0.1, 1, -W * 0.15, -H * 0.1, W * 0.45);
  s.addColorStop(0, "rgba(255,255,255,.9)");
  s.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = s;
  petalPath(ctx, W, H);
  ctx.fill();
  return c;
}

function makeFlower(petal: HTMLCanvasElement) {
  const S = 168;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.translate(S / 2, S / 2);
  ctx.shadowColor = "rgba(120,30,60,.25)";
  ctx.shadowBlur = 8;
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate((i / 5) * Math.PI * 2);
    ctx.translate(0, -34);
    ctx.rotate(Math.PI);
    ctx.drawImage(petal, -petal.width / 2, -petal.height / 2);
    ctx.restore();
  }
  ctx.shadowBlur = 0;
  // the heart: a blush, then stamens
  const h = ctx.createRadialGradient(0, 0, 0, 0, 0, 22);
  h.addColorStop(0, "rgba(201,79,116,.85)");
  h.addColorStop(1, "rgba(201,79,116,0)");
  ctx.fillStyle = h;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + rand(-0.1, 0.1);
    const r = rand(9, 16);
    ctx.strokeStyle = "rgba(170,50,80,.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.stroke();
    ctx.fillStyle = "#f6d36b";
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

function makeGlow(inner: string, outer: string) {
  const S = 64;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(255,255,240,1)");
  g.addColorStop(0.12, inner);
  g.addColorStop(0.4, outer);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return c;
}

function makeInk() {
  // an irregular blot with a feathered, bleeding edge, like ink on washi
  const S = 220;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.translate(S / 2, S / 2);
  const lobes = Array.from({ length: 7 }, () => ({ a: rand(0, Math.PI * 2), f: rand(2, 7), amp: rand(0.03, 0.09) }));
  const radius = (a: number) => 1 + lobes.reduce((s, l) => s + Math.sin(a * l.f + l.a) * l.amp, 0);
  const layers = 9;
  for (let k = layers; k >= 1; k--) {
    const R = (S * 0.36 * (0.55 + (k / layers) * 0.45));
    ctx.beginPath();
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      const r = R * radius(a) * (1 + rand(-0.012, 0.012));
      if (i) ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(22,17,14,${k === layers ? 0.1 : 0.16})`;
    ctx.fill();
  }
  // denser pooled centre
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, S * 0.26);
  g.addColorStop(0, "rgba(12,9,8,.75)");
  g.addColorStop(1, "rgba(12,9,8,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, S * 0.26, 0, Math.PI * 2);
  ctx.fill();
  return c;
}

/* ───────────────────────────── component ───────────────────────────── */

export default function ClickBloom() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduced = prefersReducedMotion();
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const petals = [
      makePetal("#e98fab", "#fbd3df", "#fff3f6"),
      makePetal("#f2a5bd", "#ffe0e9", "#ffffff"),
      makePetal("#d9799a", "#f7c5d4", "#fde9ef"),
      makePetal("#f7c1d1", "#fff0f4", "#ffffff"),
    ];
    const flower = makeFlower(petals[1]);
    const firefly = makeGlow("rgba(255,214,120,.95)", "rgba(242,180,90,.28)");
    const glint = makeGlow("rgba(220,255,240,.9)", "rgba(160,230,210,.2)");
    const blush = makeGlow("rgba(255,200,215,.9)", "rgba(244,182,200,.22)");
    const inks = [makeInk(), makeInk(), makeInk()];

    let dpr = 1;
    let W = 0;
    let H = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const ps: P[] = [];
    const add = (p: Partial<P> & Pick<P, "kind" | "x" | "y">) => {
      if (ps.length >= MAX) ps.shift();
      ps.push({
        vx: 0,
        vy: 0,
        age: 0,
        life: 1,
        size: 1,
        rot: 0,
        vr: 0,
        flip: 0,
        vflip: 0,
        sway: 0,
        phase: rand(0, 6.28),
        alpha: 1,
        delay: 0,
        drag: 0.985,
        gravity: 0,
        ...p,
      });
      wake();
    };

    /* the cursor is wind */
    const wind = { x: -1e4, y: -1e4, vx: 0, vy: 0, t: 0 };

    /* ── effects ── */
    const themeAt = (target: EventTarget | null): Theme => {
      const el = target instanceof Element ? target : null;
      if (el?.closest("footer")) return "sakura";
      const s = getStore().scene;
      return s <= 1 ? "sakura" : s === 2 ? "pond" : s === 3 ? "ink" : "night";
    };

    const sakura = (x: number, y: number, power: number) => {
      // 1) the flower opens under the cursor
      add({ kind: "flower", x, y, life: 0.62, size: 0.42 + power * 0.1, rot: rand(-0.6, 0.6), vr: rand(-1.4, 1.4), sprite: flower });
      // 2) a ring of light
      add({ kind: "ring", x, y, life: 0.7, size: 46 + power * 30, color: "255,226,234", width: 2.2 });
      add({ kind: "glow", x, y, life: 0.5, size: 90 + power * 40, sprite: blush, alpha: 0.7 });
      // 3) …then lets go of its petals
      const n = Math.round((reduced ? 0 : 16) * power);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rand(-0.25, 0.25);
        const sp = rand(2.2, 6.2) * (0.8 + power * 0.25);
        add({
          kind: "petal",
          x: x + Math.cos(a) * 10,
          y: y + Math.sin(a) * 10,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - rand(1, 2.6),
          life: rand(1.8, 2.8) + power * 0.3,
          size: rand(0.18, 0.32) * (i < 5 ? 1.25 : 1),
          rot: a + Math.PI / 2,
          vr: rand(-0.12, 0.12),
          flip: rand(0, 6.28),
          vflip: rand(0.08, 0.18),
          sway: rand(0.3, 0.9),
          sprite: pick(petals),
          delay: i < 5 ? 0.16 : rand(0.12, 0.26),
          drag: 0.955,
          gravity: 0.045,
        });
      }
    };

    const pond = (x: number, y: number, power: number) => {
      const rings = 3 + Math.round(power);
      for (let i = 0; i < rings; i++)
        add({ kind: "ring", x, y, life: 1.5 + i * 0.12, size: (70 + i * 26) * (0.8 + power * 0.35), color: "235,255,248", width: 2.6 - i * 0.4, delay: i * 0.17, alpha: 0.85 - i * 0.12 });
      add({ kind: "glow", x, y, life: 0.6, size: 70 + power * 30, sprite: glint, alpha: 0.75 });
      // glints thrown off the surface
      if (!reduced)
        for (let i = 0; i < 8 * power; i++) {
          const a = rand(0, Math.PI * 2);
          const sp = rand(1.5, 4);
          add({ kind: "glow", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rand(0.5, 0.9), size: rand(10, 18), sprite: glint, drag: 0.93, alpha: 0.9 });
        }
      // and a petal comes to rest on the water, turning slowly
      if (!reduced)
        add({ kind: "petal", x: x + rand(-14, 14), y: y + rand(-14, 14), life: 3.2, size: rand(0.26, 0.34), rot: rand(0, 6.28), vr: rand(-0.012, 0.012), flip: 0, vflip: 0, sprite: pick(petals), drag: 0.97, float: true, delay: 0.1, vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4) });
    };

    const ink = (x: number, y: number, power: number) => {
      add({ kind: "ink", x, y, life: 2.4 + power * 0.4, size: 0.5 + power * 0.28, rot: rand(0, 6.28), sprite: pick(inks), alpha: 0.9 });
      if (reduced) return;
      // spatter: flung droplets that land and stay a moment
      const n = Math.round(10 * power);
      for (let i = 0; i < n; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(2, 9) * (0.8 + power * 0.2);
        add({ kind: "dot", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rand(1.6, 2.4), size: rand(1.2, 4.2), color: "18,14,12", drag: 0.8, alpha: 0.85 });
      }
      add({ kind: "ring", x, y, life: 0.55, size: 40 + power * 22, color: "184,50,47", width: 1.6, alpha: 0.6 });
    };

    const night = (x: number, y: number, power: number) => {
      add({ kind: "ring", x, y, life: 0.9, size: 52 + power * 30, color: "242,180,90", width: 1.8 });
      add({ kind: "glow", x, y, life: 0.7, size: 120 + power * 50, sprite: firefly, alpha: 0.55 });
      const n = Math.round((reduced ? 0 : 11) * power);
      for (let i = 0; i < n; i++) {
        const a = rand(0, Math.PI * 2);
        const sp = rand(0.6, 2.6);
        add({
          kind: "glow",
          x: x + Math.cos(a) * rand(4, 18),
          y: y + Math.sin(a) * rand(4, 18),
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - rand(0.4, 1.4),
          life: rand(2.2, 3.6),
          size: rand(14, 26),
          sprite: firefly,
          drag: 0.975,
          gravity: -0.012,
          sway: rand(0.4, 1.1),
          alpha: 1,
          delay: rand(0, 0.12),
        });
      }
    };

    const burst = (x: number, y: number, theme: Theme, power = 1) =>
      (theme === "sakura" ? sakura : theme === "pond" ? pond : theme === "ink" ? ink : night)(x, y, power);

    /* ── input ── */
    let press: { x: number; y: number; t: number; theme: Theme; charge?: P; lastTrail: number; id: number } | null = null;
    const ignore = (t: EventTarget | null) => !getStore().ready || (t instanceof Element && !!t.closest("[data-fx-off]"));

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || ignore(e.target)) return;
      const theme = themeAt(e.target);
      burst(e.clientX, e.clientY, theme, 1);
      press = { x: e.clientX, y: e.clientY, t: performance.now(), theme, lastTrail: 0, id: e.pointerId };
    };
    const onUp = (e: PointerEvent) => {
      if (!press || e.pointerId !== press.id) return;
      const held = (performance.now() - press.t) / 1000;
      if (held > 0.28) {
        const power = 1 + Math.min(1, (held - 0.28) / 0.9) * 1.6;
        burst(e.clientX, e.clientY, press.theme, power);
      }
      if (press.charge) press.charge.life = press.charge.age; // let it go
      press = null;
    };
    // touch: bloom on tap only, so scrolling with a finger never sets anything off
    const onClick = (e: MouseEvent) => {
      const pt = (e as PointerEvent).pointerType;
      if (pt === "mouse" || (!pt && !coarse) || (!e.clientX && !e.clientY)) return;
      if (ignore(e.target)) return;
      burst(e.clientX, e.clientY, themeAt(e.target), 0.9);
    };
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(8, now - wind.t);
      wind.vx = ((e.clientX - wind.x) / dt) * 16;
      wind.vy = ((e.clientY - wind.y) / dt) * 16;
      if (Math.abs(wind.vx) > 400) wind.vx = wind.vy = 0; // first move
      wind.x = e.clientX;
      wind.y = e.clientY;
      wind.t = now;
      if (!press || e.pointerType === "touch") return;
      press.x = e.clientX;
      press.y = e.clientY;
      // drag: a brush of petals (or ink, or fireflies) behind the cursor
      const speed = Math.hypot(wind.vx, wind.vy);
      if (speed > 6 && now - press.lastTrail > 34 && !reduced) {
        press.lastTrail = now;
        const th = press.theme;
        if (th === "sakura")
          add({ kind: "petal", x: e.clientX, y: e.clientY, vx: wind.vx * 0.25 + rand(-1, 1), vy: wind.vy * 0.25 + rand(-1.5, 0), life: rand(1.4, 2.2), size: rand(0.16, 0.26), rot: rand(0, 6.28), vr: rand(-0.1, 0.1), flip: rand(0, 6), vflip: rand(0.08, 0.16), sway: rand(0.3, 0.8), sprite: pick(petals), drag: 0.95, gravity: 0.04 });
        else if (th === "pond") add({ kind: "ring", x: e.clientX, y: e.clientY, life: 1.1, size: rand(30, 50), color: "235,255,248", width: 1.6, alpha: 0.7 });
        else if (th === "ink") add({ kind: "dot", x: e.clientX, y: e.clientY, life: 1.8, size: Math.min(7, 2 + speed * 0.08), color: "18,14,12", alpha: 0.75, drag: 0.8 });
        else add({ kind: "glow", x: e.clientX, y: e.clientY, vx: rand(-0.6, 0.6), vy: rand(-1.2, -0.2), life: rand(1.4, 2.2), size: rand(12, 20), sprite: firefly, drag: 0.97, gravity: -0.01, sway: 0.6 });
      }
      if (press) wake();
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    /* ── loop: runs only while something is on screen ── */
    let raf = 0;
    let alive = false;
    let last = 0;
    function wake() {
      if (raf) return;
      if (!alive) {
        canvas!.style.visibility = "visible";
        alive = true;
      }
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    const chargeColor: Record<Theme, string> = { sakura: "255,214,226", pond: "235,255,248", ink: "184,50,47", night: "242,180,90" };

    function frame(now: number) {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = dt * 60; // physics tuned per 60fps frame

      // holding: grow a charge ring
      if (press) {
        const held = (now - press.t) / 1000;
        if (held > 0.28 && !press.charge) {
          press.charge = { kind: "charge", x: press.x, y: press.y, vx: 0, vy: 0, age: 0, life: 1e9, size: 1, rot: 0, vr: 0, flip: 0, vflip: 0, sway: 0, phase: 0, alpha: 1, delay: 0, drag: 1, gravity: 0, color: chargeColor[press.theme] };
          ps.push(press.charge);
        }
        if (press.charge) {
          press.charge.x = press.x;
          press.charge.y = press.y;
          press.charge.size = Math.min(1, (held - 0.28) / 0.9);
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const windAge = (now - wind.t) / 1000;
      const gust = windAge < 0.08 ? 1 : 0;

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.age += dt;
        if (p.age >= p.life + p.delay) {
          ps.splice(i, 1);
          continue;
        }
        const t = p.age - p.delay;
        if (t < 0) continue;
        const u = t / p.life; // 0→1

        // motion
        if (p.kind === "petal" || p.kind === "glow" || p.kind === "dot") {
          const drag = Math.pow(p.drag, k);
          p.vx *= drag;
          p.vy = p.vy * drag + p.gravity * k;
          if (p.sway) p.vx += Math.sin(t * 2.4 + p.phase) * p.sway * 0.06 * k;
          // the cursor blows drifting things aside
          if (gust && p.kind !== "dot") {
            const dx = p.x - wind.x;
            const dy = p.y - wind.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 140 * 140) {
              const f = (1 - Math.sqrt(d2) / 140) * 0.09;
              p.vx += wind.vx * f;
              p.vy += wind.vy * f;
              p.vr += (wind.vx * 0.0006) * (Math.random() - 0.3);
            }
          }
          p.x += p.vx * k;
          p.y += p.vy * k;
          p.rot += p.vr * k;
          p.flip += p.vflip * k;
        }

        switch (p.kind) {
          case "flower": {
            // open (overshoot), hold a breath, then the petals leave and it fades
            const open = easeOutBack(Math.min(1, t / 0.24));
            const s = p.size * (u < 0.4 ? open : 1 + (u - 0.4) * 0.35);
            const a = u < 0.35 ? 1 : 1 - (u - 0.35) / 0.65;
            ctx.globalAlpha = Math.max(0, a);
            ctx.setTransform(dpr * s * Math.cos(p.rot + t * p.vr), dpr * s * Math.sin(p.rot + t * p.vr), -dpr * s * Math.sin(p.rot + t * p.vr), dpr * s * Math.cos(p.rot + t * p.vr), p.x * dpr, p.y * dpr);
            ctx.drawImage(p.sprite!, -p.sprite!.width / 2, -p.sprite!.height / 2);
            break;
          }
          case "petal": {
            const fadeIn = Math.min(1, t / 0.12);
            const fadeOut = u > 0.7 ? 1 - (u - 0.7) / 0.3 : 1;
            ctx.globalAlpha = fadeIn * fadeOut * p.alpha;
            const s = p.size * dpr * (p.float ? 1 - Math.max(0, u - 0.6) * 0.4 : 1);
            const fl = p.float ? 1 : Math.cos(p.flip); // tumbling in 3D
            const c = Math.cos(p.rot);
            const sn = Math.sin(p.rot);
            ctx.setTransform(c * s, sn * s, -sn * s * fl, c * s * fl, p.x * dpr, p.y * dpr);
            ctx.drawImage(p.sprite!, -p.sprite!.width / 2, -p.sprite!.height / 2);
            break;
          }
          case "ring": {
            const e = easeOut(u);
            const r = Math.max(0.1, p.size * e);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.globalAlpha = (1 - u) * (1 - u) * p.alpha;
            ctx.strokeStyle = `rgb(${p.color})`;
            ctx.lineWidth = (p.width ?? 2) * (1 - u * 0.7);
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.stroke();
            break;
          }
          case "glow": {
            const flick = p.sway ? 0.75 + 0.25 * Math.sin(t * 9 + p.phase) : 1;
            const a = (u < 0.15 ? u / 0.15 : 1 - (u - 0.15) / 0.85) * p.alpha * flick;
            const s = p.size * (p.sway ? 1 : 0.6 + easeOut(u) * 0.6);
            ctx.globalAlpha = Math.max(0, a);
            ctx.globalCompositeOperation = "lighter";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.drawImage(p.sprite!, p.x - s / 2, p.y - s / 2, s, s);
            ctx.globalCompositeOperation = "source-over";
            break;
          }
          case "ink": {
            // bleeds outward fast, then slowly; fades like drying ink
            const g = 0.35 + 0.65 * easeOut(Math.min(1, t / 0.9));
            const s = p.size * g * dpr;
            ctx.globalAlpha = p.alpha * (u < 0.55 ? 1 : 1 - (u - 0.55) / 0.45);
            const c = Math.cos(p.rot);
            const sn = Math.sin(p.rot);
            ctx.setTransform(c * s, sn * s, -sn * s, c * s, p.x * dpr, p.y * dpr);
            ctx.drawImage(p.sprite!, -p.sprite!.width / 2, -p.sprite!.height / 2);
            break;
          }
          case "dot": {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.globalAlpha = p.alpha * (u < 0.6 ? 1 : 1 - (u - 0.6) / 0.4);
            ctx.fillStyle = `rgb(${p.color})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * (1 + Math.min(0.4, t * 0.6)), 0, Math.PI * 2);
            ctx.fill();
            break;
          }
          case "charge": {
            // a thin ring that closes as you hold, with a soft breathing core
            const r = 30 + p.size * 16;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.globalAlpha = 0.35;
            ctx.strokeStyle = `rgb(${p.color})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 0.95;
            ctx.lineWidth = 2.4;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, -Math.PI / 2, -Math.PI / 2 + p.size * Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 0.18 + 0.12 * Math.sin(now / 120);
            ctx.fillStyle = `rgb(${p.color})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r * 0.55 * (0.6 + p.size * 0.4), 0, Math.PI * 2);
            ctx.fill();
            break;
          }
        }
      }
      ctx.globalAlpha = 1;

      if (ps.length || press) raf = requestAnimationFrame(frame);
      else {
        // idle: clear, and take the canvas out of compositing
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        canvas!.style.visibility = "hidden";
        alive = false;
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[45] h-full w-full" style={{ visibility: "hidden" }} />;
}
