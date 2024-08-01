import { useState } from "react";
import { useEventListener } from "./useEventListener";
import { window } from "./utils/globals";
import { isSSR } from "./utils/ssr";

const matcher = isSSR ? undefined : window.matchMedia("(prefers-reduced-motion: reduce)");

export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(matcher?.matches ?? false);

  useEventListener(
    "change",
    (ev) => {
      setPrefersReducedMotion(ev.matches);
    },
    {
      eventTarget: matcher,
      passive: true,
    },
  );

  return prefersReducedMotion;
};
