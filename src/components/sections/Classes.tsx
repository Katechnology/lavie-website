"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cta, faqs, formats, site, steps } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Classes() {
  const root = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
          gsap.from(el.children, {
            y: 34,
            opacity: 0,
            stagger: 0.09,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          });
        });
        gsap.fromTo(
          "[data-shade]",
          { autoAlpha: 0 },
          { autoAlpha: 1, ease: "none", scrollTrigger: { trigger: "#lop-hoc", start: "top 90%", end: "top 30%", scrub: true } },
        );
        // the room dims as we reach the invitation
        gsap.fromTo(
          "[data-dim]",
          { autoAlpha: 0 },
          { autoAlpha: 1, ease: "none", scrollTrigger: { trigger: "#lien-he", start: "top bottom", end: "top 20%", scrub: true } },
        );
      });
      // without motion, keep the room shaded so the copy always reads
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const toggle = (sel: string, trigger: string, on: number) =>
          ScrollTrigger.create({
            trigger,
            start: "top 60%",
            end: "max",
            onToggle: (self) => gsap.set(sel, { autoAlpha: self.isActive ? on : 0 }),
          });
        toggle("[data-shade]", "#lop-hoc", 1);
        toggle("[data-dim]", "#lien-he", 0.6);
      });
    },
    { scope: root },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.contact.phoneRaw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div ref={root} className="relative">
      {/* a soft shade over the lit wall so the copy reads, then a full dim for the invitation */}
      <div
        data-shade
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] bg-[linear-gradient(90deg,rgba(13,11,10,.05)_10%,rgba(13,11,10,.5)_48%,rgba(13,11,10,.62)_100%)] opacity-0 max-md:bg-[rgba(13,11,10,.55)] invisible"
      />
      {/* fixed dimmer that only shows over the room near the end */}
      <div data-dim aria-hidden className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(90%_70%_at_50%_45%,rgba(13,11,10,.55),rgba(13,11,10,.85))] opacity-0 invisible" />

      <section id="lop-hoc" aria-labelledby="classes-title" className="relative z-[2] px-[var(--gutter)] pt-[16vh] pb-[10vh]">
        <div className="mx-auto max-w-[1240px] md:grid md:grid-cols-[0.8fr_1.2fr] md:gap-10">
          <div className="hidden md:block" />
          <div>
            <div data-rise className="text-cream text-shadow-night">
              <p className="mono-label mb-3 text-cream/70">夜の教室 · lớp học buổi tối</p>
              <h2 id="classes-title" className="font-serif text-[clamp(44px,6.6vw,108px)] leading-[0.9] font-[460] tracking-[-0.045em]">
                Học theo <br />
                <span className="italic text-lamp">cách của bạn.</span>
              </h2>
              <p className="mt-5 max-w-[44ch] text-[16.5px] leading-[1.55] text-cream/85 md:text-[18px]">
                Bốn hình thức, một cách dạy: chậm rãi, rõ ràng, và luôn có người trả lời khi bạn hỏi “tại sao?”.
              </p>
            </div>

            <ul data-rise className="mt-10 grid gap-3 sm:grid-cols-2">
              {formats.map((f) => (
                <li key={f.title} className="glass-warm group rounded-[18px] p-6 transition-transform duration-500 hover:-translate-y-1">
                  <p className="jp text-[13px] text-lamp/90">{f.jp}</p>
                  <h3 className="mt-2 font-serif text-[25px] leading-tight tracking-[-0.02em] text-cream">{f.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.6] text-cream/75">{f.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* how a trial lesson works */}
        <div className="mx-auto mt-[16vh] max-w-[1240px]">
          <div data-rise className="text-center text-cream text-shadow-night">
            <p className="mono-label mb-3 text-cream/70">体験レッスン · buổi học thử</p>
            <h2 className="font-serif text-[clamp(36px,4.8vw,72px)] leading-[0.95] font-[460] tracking-[-0.04em]">
              Bắt đầu <span className="italic">trong ba bước.</span>
            </h2>
          </div>
          <ol data-rise className="mt-10 grid gap-3 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.n} className="glass-warm relative overflow-hidden rounded-[18px] p-7">
                <span className="jp pointer-events-none absolute -top-3 -right-1 text-[120px] leading-none text-lamp/15" aria-hidden>
                  {s.n}
                </span>
                <p className="jp text-[34px] leading-none text-lamp">{s.n}</p>
                <h3 className="mt-4 font-serif text-[24px] tracking-[-0.02em] text-cream">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-cream/75">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* questions */}
        <div className="mx-auto mt-[16vh] grid max-w-[1100px] gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div data-rise className="text-cream text-shadow-night">
            <p className="mono-label mb-3 text-cream/70">よくある質問 · hỏi nhanh</p>
            <h2 className="font-serif text-[clamp(36px,4.4vw,64px)] leading-[0.95] font-[460] tracking-[-0.04em]">
              Bạn đang <br />
              <span className="italic">thắc mắc?</span>
            </h2>
          </div>
          <div data-rise className="space-y-2">
            {faqs.map((f) => (
              <details key={f.q} onToggle={() => ScrollTrigger.refresh()} className="glass-warm group rounded-[16px] px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[19px] text-cream">
                  {f.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cream/10 text-lamp transition-transform duration-300 group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15.5px] leading-[1.65] text-cream/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── the invitation ── */}
      <section id="lien-he" aria-labelledby="cta-title" className="relative z-[2] flex min-h-[110svh] items-center justify-center px-[var(--gutter)] py-[18vh] text-center">
        <div data-rise className="mx-auto max-w-[900px] text-cream">
          <p className="mono-label mb-4 text-cream/70">今度はあなたの番 · đến lượt bạn</p>
          <h2 id="cta-title" className="font-serif text-[clamp(56px,10vw,176px)] leading-[0.86] font-[460] tracking-[-0.05em]">
            Đến lượt <span className="italic text-sakura">bạn.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[38ch] text-[17px] leading-[1.55] text-cream/85 md:text-[19px]">{cta.sub}</p>
          <a
            href={site.contact.tel}
            className="mt-10 inline-block font-serif text-[clamp(38px,6vw,84px)] leading-none tracking-[-0.035em] text-cream underline decoration-cream/25 decoration-1 underline-offset-[0.18em] transition-colors hover:text-lamp hover:decoration-lamp/60"
          >
            {site.contact.phoneDisplay}
          </a>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <a href={site.contact.tel} className="pill pill-light h-11 px-6 text-[15px]">
              Gọi cho Lavie
            </a>
            <a href={site.contact.zalo} target="_blank" rel="noopener" className="pill pill-sakura h-11 px-6 text-[15px]">
              Nhắn Zalo <span aria-hidden>{"\u2197\uFE0E"}</span>
            </a>
            <button type="button" onClick={copy} className="pill h-11 px-5 font-mono text-[13px]">
              {copied ? "Đã chép số ✓" : "Chép số"}
            </button>
          </div>
          <p className="mono-label mt-8 text-cream/55">{site.city} · Online toàn quốc</p>
        </div>
      </section>
    </div>
  );
}
