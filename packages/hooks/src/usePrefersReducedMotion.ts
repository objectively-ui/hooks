import { isSSR, window } from "@objectively/utils";
import { useState } from "react";
import { useEventListener } from "./useEventListener";

const matcher = isSSR ? undefined : window.matchMedia("(prefers-reduced-motion: reduce)");

export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEventListener(
    "change",
    () => {
      if (matcher) {
        setPrefersReducedMotion(matcher.matches);
      }
    },
    {
      eventTarget: matcher,
      passive: true,
      immediate: true,
    },
  );

  return prefersReducedMotion;
};
