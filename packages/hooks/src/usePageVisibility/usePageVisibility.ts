import { document } from "@objectively/utils";
import { useRef, useState } from "react";
import { useEventListener } from "../useEventListener";
import { useSSR } from "../useSSR";
import type { UsePageVisibilityReturn } from "./types";

const getIsVisible = () => !document.hidden;

export const usePageVisibility = (): UsePageVisibilityReturn => {
  const ssr = useSSR();
  const initialValue = ssr ? false : getIsVisible();
  const visibilityStateRef = useRef(initialValue);
  const [isVisible, setIsVisible] = useState(initialValue);

  useEventListener(
    "visibilitychange",
    () => {
      const v = getIsVisible();

      if (visibilityStateRef.current !== v) {
        visibilityStateRef.current = v;
        setIsVisible(v);
      }
    },
    {
      eventTarget: document,
      passive: true,
      immediate: true,
    },
  );

  return {
    visible: isVisible,
  };
};
