"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Mark from "./Mark";
import { loaderPhrases } from "@/content/site";
import { getStore, setStore } from "@/lib/store";

const MIN_MS = 1600;

export default function Loader() {
  const [phrase, setPhrase] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t0 = performance.now();
    const cycle = setInterval(() => setPhrase((p) => (p + 1) % loaderPhrases.length), 900);
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, MIN_MS - (performance.now() - t0));
      setTimeout(async () => {
        await document.fonts?.ready;
        setLeaving(true);
        getStore().lenis?.start();
        setStore({ ready: true });
        requestAnimationFrame(() => ScrollTrigger.refresh());
        setTimeout(() => setGone(true), 1100);
      }, wait);
    };
    window.addEventListener("lavie:stage-ready", finish);
    const failSafe = setTimeout(finish, 7000);
    return () => {
      clearInterval(cycle);
      clearTimeout(failSafe);
      window.removeEventListener("lavie:stage-ready", finish);
    };
  }, []);

  if (gone) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] grid place-items-center bg-[#f2eee8] text-ink transition-[opacity,visibility] duration-1000"
      style={{ opacity: leaving ? 0 : 1, visibility: leaving ? "hidden" : "visible" }}
    >
      <div
        className="flex flex-col items-center gap-4 transition-transform duration-1000 ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ transform: leaving ? "scale(0.92) translateY(-6px)" : "none" }}
      >
        <div style={{ animation: "stamp-in 0.7s cubic-bezier(.22,1,.36,1) both" }}>
          <Mark size={56} />
        </div>
        <p className="text-[17px] tracking-[-0.01em]" key={phrase} style={{ animation: "fade-up .5s ease both" }}>
          {loaderPhrases[phrase]}
        </p>
      </div>
      <p className="mono-label absolute bottom-6 text-ink/45">Lavie · 日本語 · Huế</p>
      <style>{`@keyframes fade-up{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
