import { deepFreeze, window } from "@objectively/utils";
import { useState } from "react";
import { useEventListener } from "../useEventListener";
import type { ViewportSize } from "./types";

const zero = deepFreeze({ width: 0, height: 0 });

export const useViewport = (): ViewportSize => {
  const [size, setSize] = useState<ViewportSize>(zero);

  useEventListener(
    "resize",
    () => {
      setSize(
        deepFreeze({
          width: window.innerWidth,
          height: window.innerHeight,
        }),
      );
    },
    {
      eventTarget: window,
      passive: true,
      immediate: true,
    },
  );

  return size;
};
