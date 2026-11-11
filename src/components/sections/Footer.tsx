"use client";

import { useRef } from "react";
import VariableProximity from "@/components/VariableProximity";
import Mark from "@/components/chrome/Mark";
import { levelStyle, sceneIds, site } from "@/content/site";
import { scrollToId, useCopy } from "@/lib/store";

export default function Footer() {
  const box = useRef<HTMLElement>(null);
  const year = 2026;
  const t = useCopy();

  const col = (title: string, items: { label: string; onClick?: () => void; href?: string; ext?: boolean }[]) => (
    <div>
      <p className="mono-label mb-4 flex items-center gap-2 text-cream/50">
        <span className="h-1 w-1 rounded-full bg-sakura" aria-hidden />
        {title}
      </p>
      <ul className="space-y-2 text-[15px]">
        {items.map((it) =>
          it.href ? (
            <li key={it.href}>
              <a href={it.href} {...(it.ext ? { target: "_blank", rel: "noopener" } : {})} className="text-cream/85 transition-colors hover:text-sakura">
                {it.label} {it.ext && <span aria-hidden>{"\u2197\uFE0E"}</span>}
              </a>
            </li>
          ) : (
            <li key={it.label}>
              <button type="button" onClick={it.onClick} className="text-cream/85 transition-colors hover:text-sakura">
                {it.label} <span aria-hidden>↑</span>
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );

  return (
    <footer ref={box} className="relative z-[3] overflow-hidden bg-night px-[var(--gutter)] pt-[14vh] pb-28 text-cream">
      <div className="mx-auto max-w-[1240px]">
        <p className="text-center font-serif leading-[0.8] select-none" aria-label="Lavie">
          <VariableProximity
            label="Lavie"
            className="italic"
            data-latin
            fromFontVariationSettings="'wght' 380, 'wdth' 100, 'opsz' 144"
            toFontVariationSettings="'wght' 760, 'wdth' 125, 'opsz' 144"
            containerRef={box}
            radius={260}
            falloff="gaussian"
            style={{ fontFamily: "var(--font-ui-serif)", fontSize: "clamp(120px, 25vw, 360px)", letterSpacing: "-0.05em" }}
          />
        </p>
        <p className="jp -mt-2 text-center text-[clamp(16px,2vw,22px)] text-cream/60">{t.footer.tagline}</p>

        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {col(
            t.footer.cols[0],
            levelStyle.map((l, i) => ({ label: `${l.code} · ${t.levels.items[i].title}`, onClick: () => scrollToId("lo-trinh") })),
          )}
          {col(
            t.footer.cols[1],
            t.classes.formats.map((f) => ({ label: f.title, onClick: () => scrollToId("lop-hoc") })),
          )}
          {col(
            t.footer.cols[2],
            sceneIds.map((s, i) => ({ label: t.scenes[i], onClick: () => scrollToId(s.id) })),
          )}
          {col(t.footer.cols[3], [
            { label: site.contact.phoneDisplay, href: site.contact.tel },
            { label: "Zalo", href: site.contact.zalo, ext: true },
            { label: t.city, href: site.contact.maps, ext: true },
          ])}
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 sm:flex-row">
          <p className="flex items-center gap-2.5 text-[14px] text-cream/60">
            <Mark size={22} ink="#f3ebdd" petal="#0d0b0a" />
            {t.footer.bottom}
          </p>
          <p className="font-mono text-[12px] text-cream/40">© {year} Lavie · 日本語</p>
        </div>
      </div>
    </footer>
  );
}
