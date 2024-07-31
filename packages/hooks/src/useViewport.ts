import { useState } from "react";
import { useEventListener } from "./useEventListener";
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
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    },
    {
      element: window,
      passive: true,
    },
  );

  return size;
};
