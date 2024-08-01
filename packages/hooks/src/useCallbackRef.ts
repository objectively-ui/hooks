import { type MutableRefObject, useRef } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const useCallbackRef = <TFunc extends (...args: any[]) => void>(
  callback: TFunc | undefined,
): MutableRefObject<TFunc> => {
  const ref = useRef<TFunc>(callback || ((() => undefined) as TFunc));

  useIsomorphicLayoutEffect(() => {
    ref.current = callback || ((() => undefined) as TFunc);
  }, [callback]);

  return ref;
};
