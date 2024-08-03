import type { UnknownFunction } from "@objectively/utils";
import { type MutableRefObject, useRef } from "react";
import { useIsomorphicLayoutEffect } from "../useIsomorphicLayoutEffect";

export const useCallbackRef = <TFunc extends UnknownFunction>(
  callback: TFunc | undefined,
): MutableRefObject<TFunc> => {
  const ref = useRef<TFunc>(callback || ((() => undefined) as TFunc));

  useIsomorphicLayoutEffect(() => {
    ref.current = callback || ((() => undefined) as TFunc);
  }, [callback]);

  return ref;
};
