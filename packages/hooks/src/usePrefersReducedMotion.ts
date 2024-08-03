import { isSSR, window } from "@objectively/utils";
import { useState } from "react";
import { useEventListener } from "./useEventListener";

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
