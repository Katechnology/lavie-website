"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { levelStyle } from "@/content/site";
import { useCopy } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Levels() {
  const root = useRef<HTMLDivElement>(null);
  const { levels } = useCopy();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // the petal drifts in on the wind, turns to face us, then is carried off
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-petal-track]", start: "top 75%", end: "bottom bottom", scrub: 0.45 } })
          .fromTo(
            "[data-petal]",
            { xPercent: 70, yPercent: 60, rotate: 38, rotateX: 55, rotateY: -30, scale: 0.45, opacity: 0 },
            { xPercent: 0, yPercent: 0, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, opacity: 1, ease: "power2.out", duration: 1 },
          )
          .fromTo("[data-petal-text] > *", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.35 }, 0.55)
          .to("[data-petal]", { rotate: -6, rotateY: 8, duration: 0.6, ease: "none" })
          .to(
            "[data-petal]",
            { xPercent: -90, yPercent: -80, rotate: -52, rotateX: -40, rotateY: 35, scale: 0.6, opacity: 0, ease: "power2.in", duration: 0.9 },
          );

        gsap.from("[data-tanzaku]", {
          y: -60,
          opacity: 0,
          rotate: (i) => (i % 2 ? 6 : -6),
          stagger: 0.12,
          duration: 1.2,
          ease: "elastic.out(1, 0.6)",
          scrollTrigger: { trigger: "[data-tanzaku-row]", start: "top 78%" },
        });
        gsap.from("[data-levels-head] > *", {
          y: 24,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-levels-head]", start: "top 80%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section id="lo-trinh" aria-labelledby="levels-title" className="relative">
        {/* ── the petal ── */}
        <div data-petal-track className="relative h-[260vh]">
          <div className="sticky top-0 grid h-[100svh] place-items-center overflow-hidden [perspective:1200px]">
            <div data-petal className="relative w-[min(92vw,860px)] [transform-style:preserve-3d] will-change-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/petal.webp" alt="" className="block w-full drop-shadow-[0_40px_50px_rgba(40,60,120,0.35)]" />
              <div
                data-petal-text
                className="absolute inset-0 flex -rotate-[24deg] flex-col items-center justify-center pr-[4%] pb-[6%] text-center text-[#6e2038]"
              >
                <p className="mono-label mb-3 text-[#6e2038]/70">{levels.label}</p>
                <h2 id="levels-title" className="font-serif text-[clamp(44px,8vw,112px)] leading-[0.88] font-[480] tracking-[-0.045em]">
                  <span className="block">{levels.title[0]}</span>
                  <span className="block italic">{levels.title[1]}</span>
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* ── four tanzaku, hung on the wind ── */}
        <div className="relative px-[var(--gutter)] pt-[4vh] pb-[18vh]">
          <div data-levels-head className="mx-auto mb-12 max-w-[1000px] text-center text-white text-shadow-soft">
            <p className="mono-label mb-3 text-white/85">{levels.headLabel}</p>
            <h3 className="font-serif text-[clamp(36px,5.2vw,76px)] leading-[0.95] font-[460] tracking-[-0.04em]">
              <span data-phrase>{levels.head[0]}</span>
              <span data-phrase className="italic">{levels.head[1]}</span>
            </h3>
            <p className="mx-auto mt-5 max-w-[46ch] text-[16.5px] leading-[1.55] text-white/95 md:text-[18px]">
              {levels.sub}
            </p>
          </div>

          <div data-tanzaku-row className="relative mx-auto max-w-[1180px]">
            {/* the cord they hang from */}
            <div className="absolute inset-x-[-4%] top-[10px] hidden h-[2px] rounded-full bg-[#7a4a2a]/70 shadow-[0_2px_6px_rgba(0,0,0,.2)] md:block" />
            <ol className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pt-3 pb-6 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
              {levelStyle.map((l, i) => (
                <li
                  key={l.code}
                  data-tanzaku
                  className="w-[74vw] max-w-[280px] shrink-0 snap-center md:w-auto md:max-w-none"
                  style={{ transformOrigin: "50% 0" }}
                >
                  <article
                    className="group relative origin-top cursor-default"
                    style={
                      {
                        animation: `sway ${5.5 + i * 0.7}s ease-in-out ${i * -1.3}s infinite`,
                        "--sway-from": `${i % 2 ? 1.4 : -1.4}deg`,
                        "--sway-to": `${i % 2 ? -1.2 : 1.2}deg`,
                      } as React.CSSProperties
                    }
                  >
                    {/* string */}
                    <span className="absolute -top-3 left-1/2 h-6 w-px -translate-x-1/2 bg-[#7a4a2a]/80" aria-hidden />
                    <div
                      className="relative flex min-h-[440px] flex-col overflow-hidden rounded-[3px] px-6 pt-9 pb-6 shadow-[0_30px_50px_-24px_rgba(20,40,90,.55),0_2px_0_rgba(255,255,255,.4)_inset] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-2 md:min-h-[470px]"
                      style={{
                        backgroundColor: l.tint,
                        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,0) 30%), url(/img/paper.webp)`,
                        backgroundSize: "auto, 360px",
                        backgroundBlendMode: "normal, multiply",
                        color: l.ink,
                      }}
                    >
                      <span className="absolute top-3 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-black/15 shadow-[inset_0_1px_2px_rgba(0,0,0,.35)]" aria-hidden />
                      <p className="mono-label opacity-70">{levels.stage} {String(i + 1).padStart(2, "0")}</p>
                      <p className="mt-1 font-serif text-[76px] leading-[0.9] font-[500] tracking-[-0.05em]">{l.code}</p>
                      <p className="mt-2 font-serif text-[25px] leading-tight italic">{levels.items[i].title}</p>
                      <p
                        className="jp absolute top-24 right-5 text-[19px] leading-none opacity-80"
                        style={{ writingMode: "vertical-rl" }}
                        aria-hidden
                      >
                        {l.jp}
                      </p>
                      <ul className="mt-6 space-y-2.5 pr-8 text-[15px] leading-snug">
                        {levels.items[i].points.map((pt) => (
                          <li key={pt} className="flex gap-2">
                            <span aria-hidden className="mt-[0.5em] h-[5px] w-[5px] shrink-0 rounded-full bg-current opacity-60" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-auto border-t border-current/15 pt-4 font-mono text-[12px] tracking-tight opacity-80">{levels.items[i].stats}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
            <p className="mono-label mt-2 text-center text-white/80 md:hidden">{levels.swipe}</p>
          </div>
        </div>
      </section>
      {/* camera follows the petals down, over the garden, into the lotus pond */}
      <div data-transition="1" aria-hidden className="h-[200vh]" />
    </div>
  );
}
