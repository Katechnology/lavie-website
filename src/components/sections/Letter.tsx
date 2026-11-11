"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ScrollReveal from "@/components/ScrollReveal";
import TiltedCard from "@/components/TiltedCard";
import { letter, site } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Hanko() {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16" aria-hidden style={{ animation: "none" }}>
      <defs>
        <filter id="hanko-rough">
          <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3" />
        </filter>
      </defs>
      <g filter="url(#hanko-rough)" opacity="0.9">
        <rect x="8" y="8" width="84" height="84" rx="12" fill="none" stroke="#b8322f" strokeWidth="6" />
        <text x="50" y="47" textAnchor="middle" fontSize="30" fill="#b8322f" style={{ fontFamily: "var(--font-ui-jp)", fontWeight: 700 }}>
          ラヴィ
        </text>
        <text x="50" y="78" textAnchor="middle" fontSize="22" fill="#b8322f" style={{ fontFamily: "var(--font-ui-jp)", fontWeight: 700 }}>
          先生
        </text>
      </g>
    </svg>
  );
}

export default function Letter() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // the letter is set down on the stone like a sheet of paper
        gsap.fromTo(
          "[data-sheet]",
          { y: 120, rotate: -7, rotateX: 28, opacity: 0, transformPerspective: 1400 },
          { y: 0, rotate: -1.2, rotateX: 0, opacity: 1, ease: "power3.out", scrollTrigger: { trigger: "[data-sheet]", start: "top 95%", end: "top 45%", scrub: 0.4 } },
        );
        gsap.fromTo(
          "[data-polaroid]",
          { y: -80, x: 60, rotate: 18, opacity: 0 },
          { y: 0, x: 0, rotate: 5, opacity: 1, ease: "power3.out", scrollTrigger: { trigger: "[data-sheet]", start: "top 80%", end: "top 35%", scrub: 0.4 } },
        );
        gsap.from("[data-hanko]", {
          scale: 1.8,
          rotate: -25,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: { trigger: "[data-hanko]", start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section id="ve-lavie" aria-labelledby="letter-title" className="relative px-[var(--gutter)] pt-[14vh] pb-[22vh]">
        <div className="mx-auto max-w-[1180px] md:pl-[22%]">
          <div className="relative mx-auto max-w-[680px]">
            {/* polaroid */}
            <div
              data-polaroid
              className="relative z-10 mx-auto mb-[-56px] w-[220px] md:absolute md:-top-16 md:-right-36 md:mx-0 md:mb-0 md:w-[250px]"
            >
              <span className="absolute -top-3 left-1/2 z-20 h-7 w-24 -translate-x-1/2 rotate-2 bg-[#cfe3d0]/85 shadow-sm" aria-hidden />
              <TiltedCard
                altText="Ảnh Lavie, chạm để lật"
                containerHeight="352px"
                containerWidth="100%"
                imageHeight="352px"
                imageWidth="100%"
                radius={2}
                rotateAmplitude={10}
                scaleOnHover={1.04}
                showTooltip={false}
                glare={0.35}
                shadow={0.6}
                backContent={
                  <div className="washi flex h-full w-full flex-col justify-center p-5 text-ink">
                    <p className="font-serif text-[20px] leading-snug italic">“Hẹn gặp bạn ở lớp nhé!”</p>
                    <p className="jp mt-3 text-[15px] text-ink/70">またね 🌸</p>
                  </div>
                }
              >
                <div className="h-full bg-[#fbf8f2] px-3 pt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/lavie-polaroid.webp" alt="Lavie, giáo viên tiếng Nhật ở Huế" className="block h-[280px] w-full object-cover" />
                  <p className="mt-3 text-center font-serif text-[16px] text-ink/80 italic">Lavie · {site.city.split(",")[0]}</p>
                </div>
              </TiltedCard>
              <p className="mt-3 text-center"><span className="mono-label rounded-full bg-ink/70 px-2.5 py-1 text-[10px] text-cream">chạm để lật ↻</span></p>
            </div>

            {/* the letter */}
            <article
              data-sheet
              className="washi relative rounded-[3px] px-7 pt-20 pb-10 text-ink shadow-[0_50px_70px_-35px_rgba(40,25,10,.6),0_2px_0_rgba(255,255,255,.6)_inset] sm:px-12 md:pt-14 md:pr-24"
            >
              {/* faint ruled lines like 便箋 letter paper */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-10 bottom-10 opacity-[0.22]"
                style={{ backgroundImage: "repeating-linear-gradient(180deg, transparent 0 33px, #b8322f 33px 34px)" }}
              />
              <p className="mono-label relative text-ink/55">{letter.kicker}</p>
              <h2 id="letter-title" className="relative mt-4 font-serif text-[clamp(34px,4.4vw,52px)] leading-none font-[460] tracking-[-0.035em] italic">
                {letter.greeting}
              </h2>
              <div className="relative mt-4">
                {letter.paragraphs.map((p) => (
                  <ScrollReveal
                    key={p}
                    as="p"
                    baseOpacity={0.12}
                    enableBlur={false}
                    baseRotation={0}
                    containerClassName="my-0! mb-4!"
                    textClassName="text-[17px]! leading-[34px]! font-normal! md:text-[18.5px]! text-ink"
                  >
                    {p}
                  </ScrollReveal>
                ))}
              </div>
              <div className="relative mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[17px] italic text-ink/75">{letter.signoff}</p>
                  <p className="mt-1 font-serif text-[44px] leading-none italic tracking-[-0.03em]">Lavie</p>
                  <p className="jp mt-1 text-[14px] text-ink/60">{site.nameJp} · フエより</p>
                </div>
                <div data-hanko className="-rotate-[8deg]">
                  <Hanko />
                </div>
              </div>

              {site.credentials.length > 0 && (
                <dl className="relative mt-8 grid grid-cols-2 gap-4 border-t border-ink/15 pt-6 sm:grid-cols-4">
                  {site.credentials.map((c) => (
                    <div key={c.label}>
                      <dt className="mono-label text-ink/55">{c.label}</dt>
                      <dd className="font-serif text-[30px] leading-none">{c.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </article>
          </div>

          {site.testimonials.length > 0 && (
            <ul className="mx-auto mt-14 grid max-w-[980px] gap-4 md:grid-cols-3">
              {site.testimonials.map((t) => (
                <li key={t.name} className="washi rounded-[3px] p-6 text-ink shadow-[0_30px_40px_-25px_rgba(0,0,0,.5)]">
                  <p className="font-serif text-[17px] leading-relaxed italic">“{t.quote}”</p>
                  <p className="mt-4 text-[14px] font-medium">{t.name}</p>
                  <p className="mono-label text-ink/55">{t.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {/* the light fades; ink spreads; we are inside, at night */}
      <div data-transition="3" aria-hidden className="h-[160vh]" />
    </div>
  );
}
