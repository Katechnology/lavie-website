/** Painted scenes, in journey order. `loop` = ambient video key (null → still only). */
export const STAGE_SCENES = [
  { key: "hero", loop: "hero" },
  { key: "sky", loop: "sky" },
  { key: "pond", loop: "pond" },
  { key: "bank", loop: null },
  { key: "room", loop: "room" },
] as const;

/** Scroll-scrubbed camera moves between consecutive scenes (frame sequences in /public/seq). */
export const TRANSITIONS = ["t12", "t23", "t34", "t45"] as const;

/** "m" = the 9:16 set painted for phones, "d" = the 16:9 set. */
export type Orient = "d" | "m";

export const detectOrient = (): Orient =>
  typeof window !== "undefined" && window.innerHeight > window.innerWidth * 1.15 ? "m" : "d";

const suffix = (o: Orient) => (o === "m" ? "-m" : "");

export const poster = (key: string, o: Orient) => `/scenes/${key}${suffix(o)}.webp`;

type Conn = { saveData?: boolean; effectiveType?: string };
const conn = (): Conn | undefined => (navigator as Navigator & { connection?: Conn }).connection;
const slow = () => !!conn()?.saveData || /(^|-)2g|3g/.test(conn()?.effectiveType ?? "");

/** Ambient loops: crisp. Desktop 1920×1080 / 1280×720; phones 1080×1920 / 720×1280. */
function loopRes(o: Orient): "1080" | "720" {
  if (typeof window === "undefined" || slow()) return "720";
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  if (o === "m") return window.innerWidth * dpr >= 700 ? "1080" : "720";
  return window.innerWidth * dpr >= 1500 ? "1080" : "720";
}

let webm: boolean | null = null;
export function loopSrc(key: string, o: Orient) {
  if (webm === null && typeof document !== "undefined")
    webm = document.createElement("video").canPlayType('video/webm; codecs="vp9"') === "probably";
  return `/video/${key}${suffix(o)}-${loopRes(o)}.${webm ? "webm" : "mp4"}`;
}

