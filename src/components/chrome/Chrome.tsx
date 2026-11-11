"use client";

import { useState } from "react";
import { sceneIds, site } from "@/content/site";
import { scrollToId, useCopy, useStore } from "@/lib/store";
import { LangToggle } from "./LangSwitch";

const Phone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" strokeLinejoin="round" />
  </svg>
);
const Copy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </svg>
);
const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
    <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function TopNav() {
  const ready = useStore((s) => s.ready);
  const t = useCopy();
  // phones keep the essentials: home, contact, Zalo, language (the hero has its own roadmap button)
  const items = [
    { id: "lo-trinh", label: t.nav.roadmap, wide: true },
    { id: "lop-hoc", label: t.nav.classes, wide: true },
    { id: "lien-he", label: t.nav.contact, wide: false },
  ];
  return (
    <nav
      aria-label={t.nav.main}
      className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition-[opacity,transform] duration-700 sm:top-4"
      style={{ opacity: ready ? 1 : 0, transform: ready ? "none" : "translateY(-8px)" }}
    >
      <ul className="flex max-w-full items-center gap-1 sm:gap-1.5">
        <li>
          <button type="button" onClick={() => scrollToId("doi-anh-dao")} className="pill pl-1 italic" data-latin aria-label={t.nav.top}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/lavie-avatar.webp" alt="" width={24} height={24} className="h-6 w-6 rounded-full object-cover" />
            <span className="text-[15px]">Lavie</span>
          </button>
        </li>
        {items.map((it) => (
          <li key={it.id} className={it.wide ? "hidden sm:block" : ""}>
            <button type="button" onClick={() => scrollToId(it.id)} className="pill">
              {it.label}
            </button>
          </li>
        ))}
        <li>
          <a href={site.contact.zalo} target="_blank" rel="noopener" className="pill pill-sakura" aria-label={t.nav.zaloAria}>
            Zalo <span aria-hidden className="hidden sm:inline">{"\u2197\uFE0E"}</span>
          </a>
        </li>
        <li>
          <LangToggle />
        </li>
      </ul>
    </nav>
  );
}

export function BottomPill() {
  const ready = useStore((s) => s.ready);
  const t = useCopy();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.contact.phoneRaw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <div
      className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 transition-[opacity,transform] duration-700 sm:bottom-4"
      style={{ opacity: ready ? 1 : 0, transform: ready ? "none" : "translateY(8px)" }}
    >
      <div className="flex items-center gap-1.5">
        <a href={site.contact.tel} className="pill font-mono text-[12.5px] tracking-tight" aria-label={`${t.nav.callAria} ${site.contact.phoneDisplay}`}>
          <span className="text-sakura">
            <Phone />
          </span>
          <span className="opacity-60">{t.nav.call}</span> {site.contact.phoneDisplay}
        </a>
        <button type="button" onClick={copy} className="pill pill-round relative" aria-label={t.nav.copyAria}>
          {copied ? <Check /> : <Copy />}
          <span
            className="mono-label pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded-full bg-cream px-2 py-1 text-[10px] text-ink transition-opacity"
            style={{ opacity: copied ? 1 : 0 }}
          >
            {t.nav.copied}
          </span>
        </button>
      </div>
    </div>
  );
}

export function SceneRail() {
  const scene = useStore((s) => s.scene);
  const ready = useStore((s) => s.ready);
  const t = useCopy();
  return (
    <nav
      aria-label={t.nav.scenes}
      className="fixed top-1/2 left-3 z-40 hidden -translate-y-1/2 transition-opacity duration-700 sm:block md:left-5"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <ul className="flex flex-col gap-2.5">
        {sceneIds.map((s, i) => {
          const active = i === Math.min(scene, sceneIds.length - 1);
          return (
            <li key={s.id}>
              <button type="button" onClick={() => scrollToId(s.id)} className="group flex items-center gap-2 py-0.5" aria-current={active ? "step" : undefined}>
                <span
                  className="block h-[3px] rounded-full bg-white shadow-[0_0_6px_rgba(0,0,0,.35)] transition-all duration-500"
                  style={{ width: active ? 22 : 10, opacity: active ? 1 : 0.55 }}
                />
                <span className="mono-label rounded-full bg-pill/80 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="jp mr-1 normal-case">{s.jp}</span>
                  {t.scenes[i]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function ScrollHint() {
  const ready = useStore((s) => s.ready);
  const scene = useStore((s) => s.scene);
  const t = useCopy();
  return (
    <button
      type="button"
      onClick={() => scrollToId("lo-trinh")}
      className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 transition-opacity duration-700 sm:bottom-20"
      style={{ opacity: ready && scene === 0 ? 1 : 0, pointerEvents: ready && scene === 0 ? undefined : "none" }}
      tabIndex={ready && scene === 0 ? undefined : -1}
      aria-hidden={ready && scene === 0 ? undefined : true}
      aria-label={t.nav.scrollDown}
    >
      <span className="pill pill-light h-7 text-[13px]">{t.nav.scrollDown}</span>
      <span className="pill pill-light pill-round h-7 w-7" style={{ animation: "bob 2.4s ease-in-out infinite" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
