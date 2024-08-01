import { type MutableRefObject, useRef } from "react";
import type { UnknownFunction } from "./types";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export const useCallbackRef = <TFunc extends UnknownFunction>(
  callback: TFunc | undefined,
): MutableRefObject<TFunc> => {
  const ref = useRef<TFunc>(callback || ((() => undefined) as TFunc));

  useIsomorphicLayoutEffect(() => {
    ref.current = callback || ((() => undefined) as TFunc);
  }, [callback]);

  return ref;
};
