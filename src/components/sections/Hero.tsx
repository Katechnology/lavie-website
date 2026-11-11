"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitText from "@/components/SplitText";
import { ScrollHint } from "@/components/chrome/Chrome";
import { prefersReducedMotion, scrollToId, useCopy, useStore } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const ready = useStore((s) => s.ready);
  const { hero } = useCopy();
  const wrap = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  // as the camera tilts up into the sky, the headline dissolves in place, line by line
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const lines = gsap.utils.toArray<HTMLElement>("[data-dissolve]");
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "[data-transition='0']",
            start: "top 95%",
            end: "top 25%",
            scrub: true,
          },
        })
        .to(lines, {
          opacity: 0,
          y: -40,
          scale: 0.985,
          stagger: 0.12,
          ease: "power1.in",
        });
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className="relative">
      <section
        id="doi-anh-dao"
        aria-labelledby="hero-title"
        className="sticky top-0 h-[100svh] overflow-hidden"
      >
        {/* soft scrim so white type stays readable over bright sky on small screens */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[72%] bg-gradient-to-b from-[#1f5fae]/40 via-[#24518f]/30 via-55% to-transparent md:hidden" />
        {/* desktop: deepen the sky a touch behind the copy, like a painted vignette */}
        <div className="pointer-events-none absolute top-0 right-0 hidden h-[85%] w-[62%] bg-[radial-gradient(60%_55%_at_60%_42%,rgba(28,84,170,0.42),transparent_75%)] md:block" />
        <div
          ref={copy}
          className="absolute inset-x-0 top-[13svh] px-[var(--gutter)] text-white text-shadow-soft md:inset-x-auto md:top-[13vh] md:right-[5vw] md:w-[min(47vw,720px)] md:px-0"
        >
          <div data-dissolve>
            <p
              className="mono-label mb-4 text-white/85 transition-opacity duration-700"
              style={{ opacity: ready ? 1 : 0 }}
            >
              {hero.eyebrow}
            </p>
          </div>
          <h1
            id="hero-title"
            aria-label={hero.title.join(" ")}
            className="font-serif text-[clamp(54px,8vw,138px)] leading-[0.9] font-[460] tracking-[-0.045em]"
          >
            {hero.title.map((line, i) => (
              <span
                key={i}
                data-dissolve
                className="block min-h-[0.95em]"
                aria-hidden
              >
                {ready ? (
                  <SplitText
                    text={line}
                    tag="span"
                    effect="blur"
                    splitType="chars"
                    trigger="load"
                    delay={38}
                    duration={1.1}
                    hoverEffect="lift"
                    textAlign="left"
                    className={i === 1 ? "italic" : ""}
                  />
                ) : (
                  <span className="opacity-0">{line}</span>
                )}
              </span>
            ))}
          </h1>
          <div data-dissolve className="relative">
            {/* phones: the subtitle sits over pale blossoms; a soft pool of sky-shadow behind it only */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-8 -top-2 -bottom-6 bg-[radial-gradient(closest-side,rgba(14,44,98,.55),rgba(14,44,98,.28)_60%,transparent)] transition-opacity delay-700 duration-1000 md:hidden"
              style={{ opacity: ready ? 1 : 0 }}
            />
            <p
              className="relative mt-6 max-w-[42ch] text-[16.5px] leading-[1.5] text-white [text-shadow:0_1px_2px_rgba(10,40,90,.45),0_2px_18px_rgba(10,40,100,.55)] transition-[opacity,transform] delay-700 duration-1000 md:mt-7 md:text-[19px]"
              style={{
                opacity: ready ? 1 : 0,
                transform: ready ? "none" : "translateY(10px)",
              }}
            >
              {hero.sub}
            </p>
          </div>
          <div data-dissolve>
            <div
              className="mt-7 flex flex-wrap items-center gap-2 transition-[opacity,transform] delay-1000 duration-1000"
              style={{
                opacity: ready ? 1 : 0,
                transform: ready ? "none" : "translateY(10px)",
              }}
            >
              <button
                type="button"
                onClick={() => scrollToId("lien-he")}
                className="pill pill-light h-10 px-5 text-[15px]"
              >
                {hero.primary}
                <span aria-hidden className="jp text-sakura-deep">
                  →
                </span>
              </button>
              <button
                type="button"
                onClick={() => scrollToId("lo-trinh")}
                className="pill h-10 px-5 text-[15px]"
              >
                {hero.secondary}
              </button>
            </div>
          </div>
        </div>
        <div data-dissolve>
          <ScrollHint />
        </div>
      </section>
      {/* camera tilts up: hill → sky */}
      <div data-transition="0" aria-hidden className="h-[170vh]" />
    </div>
  );
}
