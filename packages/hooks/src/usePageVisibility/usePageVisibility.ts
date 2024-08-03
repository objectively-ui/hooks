import { document } from "@objectively/utils";
import { useRef, useState } from "react";
import { useCallbackRef } from "../useCallbackRef";
import { useEventListener } from "../useEventListener";
import { useSSR } from "../useSSR";
import type { UsePageVisibilityOptions, UsePageVisibilityReturn } from "./types";

const getIsVisible = () => !document.hidden;

export const usePageVisibility = (opts?: UsePageVisibilityOptions): UsePageVisibilityReturn => {
  const ssr = useSSR();
  const initialValue = ssr ? false : getIsVisible();
  const visibilityStateRef = useRef(initialValue);
  const [isVisible, setIsVisible] = useState(initialValue);
  const onVisibilityChange = useCallbackRef(opts?.onVisibilityChange);

  useEventListener(
    "visibilitychange",
    () => {
      const v = getIsVisible();

      if (visibilityStateRef.current !== v) {
        visibilityStateRef.current = v;
        setIsVisible(v);
        onVisibilityChange.current?.(v);
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
