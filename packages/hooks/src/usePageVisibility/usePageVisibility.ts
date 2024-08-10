import { document, isSSR } from "@objectively/utils";
import { useRef, useState } from "react";
import { useEventListener } from "../useEventListener";
import type { UsePageVisibilityReturn } from "./types";

const getIsVisible = () => !document.hidden;

export const usePageVisibility = (): UsePageVisibilityReturn => {
  const initialValue = isSSR ? false : getIsVisible();
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
