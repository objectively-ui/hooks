import { useState } from "react";
import { useEventListener } from "./useEventListener";
import { deepFreeze } from "./utils/deepFreeze";
import { window } from "./utils/globals";

interface ViewportSize {
  width: number;
  height: number;
}

export const useViewport = () => {
  const [size, setSize] = useState<ViewportSize>();

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
    },
  );

  return size;
};
