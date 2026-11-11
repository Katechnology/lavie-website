"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { kana, type KanaItem } from "@/content/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Mode = keyof typeof kana;

function useJapaneseVoice() {
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const pick = () => {
      const vs = window.speechSynthesis.getVoices();
      voice.current = vs.find((v) => v.lang === "ja-JP" && /Kyoko|O-ren|Google/i.test(v.name)) ?? vs.find((v) => v.lang.startsWith("ja")) ?? null;
    };
    pick();
    window.speechSynthesis.addEventListener("voiceschanged", pick);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pick);
  }, []);
  return useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ja-JP";
    u.rate = 0.82;
    if (voice.current) u.voice = voice.current;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }, []);
}

export default function KanaPond() {
  const root = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("hiragana");
  const [active, setActive] = useState<KanaItem>(kana.hiragana.items[6]);
  const [pulse, setPulse] = useState(0);
  const speak = useJapaneseVoice();

  const choose = (item: KanaItem) => {
    setActive(item);
    setPulse((p) => p + 1);
    speak(mode === "kanji" ? item.word : `${item.glyph}。${item.word}`);
  };

  useGSAP(
    () => {
      gsap.from("[data-pond-head] > *", {
        y: 26,
        opacity: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-pond-head]", start: "top 78%" },
      });
    },
    { scope: root },
  );

  // glyphs float up like petals surfacing whenever the set changes
  useGSAP(
    () => {
      gsap.fromTo(
        "[data-glyph]",
        { y: 18, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, stagger: { each: 0.03, from: "random" }, duration: 0.8, ease: "power3.out" },
      );
    },
    { scope: board, dependencies: [mode] },
  );

  return (
    <div ref={root}>
      <section id="thu-chu" aria-labelledby="pond-title" className="relative flex min-h-[130vh] items-center px-[var(--gutter)] py-[16vh]">
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <div data-pond-head className="text-white text-shadow-night">
              <p className="mono-label mb-3 text-white/80">池 · thử một bài học nhỏ</p>
              <h2 id="pond-title" className="font-serif text-[clamp(48px,7.4vw,124px)] leading-[0.88] font-[460] tracking-[-0.045em] text-[#bfe9c8]">
                Chạm vào <br />
                <span className="italic">là nhớ.</span>
              </h2>
              <p className="mt-5 max-w-[40ch] text-[16.5px] leading-[1.55] text-white/90 md:text-[18px]">
                Chạm vào một chữ để nghe cách đọc và một từ ví dụ. Lớp của Lavie cũng vậy: học bằng tai, bằng mắt, và bằng tay.
              </p>
            </div>

            <div role="group" aria-label="Chọn bảng chữ" className="mt-8 flex flex-wrap gap-1.5">
              {(Object.keys(kana) as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => {
                    setMode(m);
                    setActive(kana[m].items[0]);
                  }}
                  className={`pill jp h-9 px-4 text-[15px] ${mode === m ? "pill-light" : "bg-black/55"}`}
                >
                  {kana[m].label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div ref={board} className="relative grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3">
                {kana[mode].items.map((it) => {
                  const on = it.glyph === active.glyph;
                  return (
                    <button
                      key={mode + it.glyph}
                      data-glyph
                      type="button"
                      onClick={() => choose(it)}
                      aria-label={`${it.glyph}, đọc là ${it.romaji}`}
                      aria-pressed={on}
                      className={`group relative grid aspect-square place-items-center rounded-full transition-[background-color,box-shadow,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 ${
                        on ? "bg-white/25 shadow-[0_0_0_1px_rgba(255,255,255,.55),0_14px_30px_-10px_rgba(0,0,0,.5)]" : "bg-[rgba(8,40,36,.38)] shadow-[0_0_0_1px_rgba(255,255,255,.16)] hover:bg-[rgba(8,40,36,.22)]"
                      }`}
                    >
                      <span className="jp text-[clamp(30px,4.4vw,50px)] leading-none text-white [text-shadow:0_2px_10px_rgba(0,30,25,.55)]">{it.glyph}</span>
                      <span className="absolute bottom-[12%] font-mono text-[10px] text-white/0 transition-colors group-hover:text-white/75">{it.romaji.split(" · ")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* the answer card, written on washi */}
          <aside aria-live="polite" className="washi relative mx-auto w-full max-w-[380px] rotate-[1.5deg] rounded-[4px] p-7 text-ink shadow-[0_40px_60px_-30px_rgba(0,0,0,.7)]">
            <span className="absolute -top-3 left-8 h-6 w-20 -rotate-3 bg-[#f4b6c8]/80 shadow-sm" aria-hidden />
            <div key={pulse} style={{ animation: "fade-up .5s ease both" }}>
              <p className="mono-label text-ink/55">{kana[mode].label}</p>
              <p className="jp mt-1 text-[120px] leading-none font-[500]">{active.glyph}</p>
              <p className="mt-2 font-mono text-[14px] text-ink/70">{active.romaji}</p>
              <div className="mt-6 border-t border-ink/15 pt-5">
                <p className="jp text-[30px] leading-tight">{active.word}</p>
                <p className="mt-1 text-[15px] text-ink/75">
                  <span className="font-mono text-[13px]">{active.reading}</span> · <span className="italic">{active.meaning}</span>
                </p>
              </div>
            </div>
            <button type="button" onClick={() => choose(active)} className="pill mt-6 h-9 text-[14px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M4 10v4h4l5 4V6L8 10H4Z" strokeLinejoin="round" />
                <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" />
              </svg>
              Nghe lại
            </button>
          </aside>
        </div>
        <style>{`@keyframes fade-up{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
      </section>
      {/* camera glides across the pond to the stone bank */}
      <div data-transition="2" aria-hidden className="h-[150vh]" />
    </div>
  );
}
