"use client";

import { useSyncExternalStore } from "react";
import type Lenis from "lenis";

type State = {
  /** 0..4 — which painted scene is currently on stage (rounded during a transition) */
  scene: number;
  /** true once the loader has finished */
  ready: boolean;
  lenis: Lenis | null;
};

let state: State = { scene: 0, ready: false, lenis: null };
const listeners = new Set<() => void>();

export function setStore(patch: Partial<State>) {
  let changed = false;
  for (const k in patch) {
    const key = k as keyof State;
    if (state[key] !== patch[key]) changed = true;
  }
  if (!changed) return;
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function getStore() {
  return state;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector({ scene: 0, ready: false, lenis: null }),
  );
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Move keyboard / screen-reader focus to where the page just scrolled to. */
function focusSection(el: HTMLElement) {
  const target = el.querySelector<HTMLElement>("h1, h2") ?? el;
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

export function scrollToId(id: string, { immediate = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  const jump = immediate || prefersReducedMotion();
  const lenis = state.lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 2.2, immediate: jump, force: true, onComplete: () => focusSection(el) });
    if (jump) focusSection(el);
  } else {
    el.scrollIntoView({ behavior: jump ? "auto" : "smooth" });
    focusSection(el);
  }
}
