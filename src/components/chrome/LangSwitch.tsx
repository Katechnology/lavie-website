"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { copy, LANGS, type Lang } from "@/content/site";
import { getStore, prefersReducedMotion, setStore, useCopy, useStore } from "@/lib/store";

/**
 * Vietnamese ⇄ Japanese.
 *
 * Switching is a small ceremony: a sheet of washi sweeps out from the toggle, the new
 * language is stamped on it like a hanko, and the page underneath changes language while
 * it is covered (so the reflow and ScrollTrigger refresh never show). Then the sheet
 * draws back to the toggle. The reader stays on the same part of the page.
 */

const KEY = "lavie-lang";
const EVENT = "lavie:switch-lang";

type SwitchDetail = { next: Lang; x: number; y: number };

function applyDocument(lang: Lang) {
  document.documentElement.lang = lang;
  document.title = copy[lang].docTitle;
}

function remember(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {}
}

/** ?lang=ja wins (shareable links), then the visitor's last choice. */
function initialLang(): Lang | null {
  try {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && (LANGS as string[]).includes(q)) return q as Lang;
    const saved = localStorage.getItem(KEY);
    if (saved && (LANGS as string[]).includes(saved)) return saved as Lang;
  } catch {}
  return null;
}

/** Where the reader is: the section under the middle of the screen, and how far into it. */
function captureAnchor() {
  const mid = window.innerHeight / 2;
  const candidates = document.querySelectorAll<HTMLElement>("main > div > section, main > div > div, main > div, footer");
  let best: { el: HTMLElement; frac: number } | null = null;
  for (const el of candidates) {
    const r = el.getBoundingClientRect();
    if (r.height > 0 && r.top <= mid && r.bottom >= mid) best = { el, frac: (mid - r.top) / r.height }; // deepest match wins
  }
  return best;
}

function restoreAnchor(a: ReturnType<typeof captureAnchor>) {
  if (!a) return;
  const r = a.el.getBoundingClientRect();
  const y = window.scrollY + r.top + a.frac * r.height - window.innerHeight / 2;
  const lenis = getStore().lenis;
  if (lenis) lenis.scrollTo(Math.max(0, y), { immediate: true, force: true });
  else window.scrollTo(0, Math.max(0, y));
}

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** The VI · 日 pill in the top nav. */
export function LangToggle() {
  const lang = useStore((s) => s.lang);
  const t = useCopy();
  const ask = (next: Lang, e: React.MouseEvent<HTMLButtonElement>) => {
    if (next === getStore().lang) return;
    const r = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(new CustomEvent<SwitchDetail>(EVENT, { detail: { next, x: r.left + r.width / 2, y: r.top + r.height / 2 } }));
  };
  return (
    <div role="group" aria-label={t.lang.group} className="pill relative gap-0 px-[3px]">
      {/* the cream thumb slides under the active language */}
      <span
        aria-hidden
        className="absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%-3px)] rounded-full bg-cream shadow-[inset_0_-2px_2px_rgba(0,0,0,.12)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ transform: lang === "ja" ? "translateX(100%)" : "none" }}
      />
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          aria-label={copy[l].lang.stamp}
          onClick={(e) => ask(l, e)}
          className={`relative z-[1] grid h-full w-8 place-items-center rounded-full text-[13px] transition-colors duration-300 ${
            lang === l ? "text-ink" : "text-white/70 hover:text-white"
          } ${l === "ja" ? "jp" : "font-mono tracking-tight"}`}
        >
          {copy[l].lang.short}
        </button>
      ))}
    </div>
  );
}

/** The washi sheet + hanko. Mounted once; listens for switch requests. */
export function LangCurtain() {
  const sheet = useRef<HTMLDivElement>(null);
  const stamp = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const busy = useRef(false);

  // first visit with ?lang=ja or a saved choice: switch silently while the loader still covers the page
  useEffect(() => {
    const l = initialLang();
    if (l && l !== getStore().lang) {
      setStore({ lang: l });
      applyDocument(l);
    }
  }, []);

  useEffect(() => {
    const run = async (e: Event) => {
      const { next, x, y } = (e as CustomEvent<SwitchDetail>).detail;
      if (busy.current || next === getStore().lang) return;
      busy.current = true;
      const el = sheet.current!;
      const st = stamp.current!;
      const reduced = prefersReducedMotion();
      const anchor = captureAnchor();
      setLabel(copy[next].lang.stamp);

      const origin = `${x}px ${y}px`;
      const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 40;
      gsap.set(el, { visibility: "visible", pointerEvents: "auto" });

      // 1 · cover
      if (reduced) {
        gsap.set(el, { clipPath: "none", opacity: 0 });
        gsap.set(st, { opacity: 1, scale: 1, rotate: -8 });
        await gsap.to(el, { opacity: 1, duration: 0.15 });
      } else {
        gsap.set(el, { opacity: 1, clipPath: `circle(0px at ${origin})` });
        gsap.set(st, { opacity: 0, scale: 1.7, rotate: -24 });
        const tl = gsap.timeline();
        tl.to(el, { clipPath: `circle(${R}px at ${origin})`, duration: 0.6, ease: "power3.inOut" });
        tl.to(st, { opacity: 1, scale: 1, rotate: -8, duration: 0.45, ease: "back.out(2.2)" }, 0.38);
        await tl;
      }

      // 2 · change language under the sheet, let layout and triggers settle, keep the reader's place
      setStore({ lang: next });
      applyDocument(next);
      remember(next);
      await nextFrame();
      await nextFrame();
      await Promise.race([document.fonts?.ready, wait(700)]);
      ScrollTrigger.refresh();
      getStore().lenis?.resize();
      restoreAnchor(anchor);
      ScrollTrigger.update();
      if (!reduced) await wait(260); // let the stamp be read

      // 3 · uncover, back into the toggle
      if (reduced) {
        await gsap.to(el, { opacity: 0, duration: 0.2 });
      } else {
        const tl = gsap.timeline();
        tl.to(st, { opacity: 0, scale: 0.9, duration: 0.25, ease: "power1.in" });
        tl.to(el, { clipPath: `circle(0px at ${origin})`, duration: 0.55, ease: "power3.inOut" }, 0.1);
        await tl;
      }
      gsap.set(el, { visibility: "hidden", pointerEvents: "none" });
      busy.current = false;
    };
    window.addEventListener(EVENT, run);
    return () => window.removeEventListener(EVENT, run);
  }, []);

  return (
    <div
      ref={sheet}
      aria-hidden
      className="washi fixed inset-0 z-[150] grid place-items-center"
      style={{ visibility: "hidden", pointerEvents: "none" }}
    >
      <div ref={stamp} className="flex flex-col items-center gap-3">
        <div className="rounded-[14px] border-[5px] border-beni px-6 py-3 text-beni [filter:url(#lang-rough)]">
          <span className="block font-serif text-[clamp(34px,7vw,64px)] leading-none font-[600] tracking-[-0.01em] whitespace-nowrap">
            {label}
          </span>
        </div>
      </div>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="lang-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
        </filter>
      </svg>
    </div>
  );
}
