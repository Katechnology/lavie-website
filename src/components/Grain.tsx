"use client";

import { useEffect, useRef } from "react";

/**
 * Film grain that costs nothing to scroll past: one small tile painted once, on an
 * oversized layer that a CSS `steps()` animation jumps around. Only `transform` changes,
 * so the compositor does all the work. No blend mode, so the video under it isn't
 * re-blended every frame.
 */
export default function Grain({ opacity = 0.07, zIndex = 1 }: { opacity?: number; zIndex?: number }) {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const S = 160;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const ctx = c.getContext("2d");
    if (!ctx || !layer.current) return;
    const img = ctx.createImageData(S, S);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      // signed noise: light and dark specks around a transparent middle, like overlay grain
      const n = (Math.random() + Math.random() + Math.random()) / 1.5 - 1; // ≈ −1…1, soft centre
      const v = n > 0 ? 255 : 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = Math.min(255, Math.abs(n) * 255);
    }
    ctx.putImageData(img, 0, 0);
    c.toBlob((b) => {
      if (b && layer.current) layer.current.style.backgroundImage = `url(${URL.createObjectURL(b)})`;
    });
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex, opacity }}>
      <div
        ref={layer}
        className="absolute -inset-[60px] will-change-transform motion-safe:animate-[grain_0.9s_steps(1)_infinite]"
        style={{ backgroundSize: "160px 160px" }}
      />
      <style>{`@keyframes grain{0%{transform:translate3d(0,0,0)}12%{transform:translate3d(-37px,21px,0)}25%{transform:translate3d(18px,-44px,0)}37%{transform:translate3d(-51px,-9px,0)}50%{transform:translate3d(29px,47px,0)}62%{transform:translate3d(-12px,-31px,0)}75%{transform:translate3d(44px,12px,0)}87%{transform:translate3d(-26px,38px,0)}}`}</style>
    </div>
  );
}
