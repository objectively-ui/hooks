import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const useCallbackRef = (callback: (...args: any[]) => void) => {
  const ref = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    ref.current = callback;
  }, [callback]);

  return ref;
};
