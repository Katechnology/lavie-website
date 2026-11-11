import { useId } from "react";

/** Hand-stamped sakura seal: ink square, five notched petals, rough printed edge. */
export default function Mark({ size = 40, className = "", ink = "#1b1712", petal = "#fbf5ec" }: { size?: number; className?: string; ink?: string; petal?: string }) {
  const id = useId().replace(/:/g, "");
  const petals = Array.from({ length: 5 }, (_, i) => i * 72);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <filter id={`rough-${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" />
        </filter>
        <filter id={`grain-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="3" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 1.32" result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#rough-${id})`}>
        <g filter={`url(#grain-${id})`}>
          <rect x="6" y="6" width="88" height="88" rx="3" fill={ink} />
        </g>
        <g transform="translate(50 51)">
          {petals.map((r) => (
            <path
              key={r}
              transform={`rotate(${r})`}
              fill={petal}
              d="M0 -4 C -9 -10, -13 -22, -8 -31 C -6 -35, -3 -36, -1.2 -33.5 L 0 -30.5 L 1.2 -33.5 C 3 -36, 6 -35, 8 -31 C 13 -22, 9 -10, 0 -4 Z"
            />
          ))}
          <circle r="3.2" fill={ink} />
        </g>
      </g>
    </svg>
  );
}
