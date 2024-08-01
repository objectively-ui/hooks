import { useEffect, useRef } from "react";
import type { UnknownFunction } from "./types";
import { useCallbackRef } from "./useCallbackRef";
import { debounce } from "./utils/debounce";

export const useDebounce = <TFunc extends UnknownFunction>(func: TFunc, delay: number): TFunc => {
  const funcRef = useCallbackRef(func);
  const ref = useRef(debounce(((...args) => funcRef.current(...args)) as TFunc, delay));

  useEffect(() => {
    ref.current = debounce(((...args) => funcRef.current(...args)) as TFunc, delay);
  }, [delay]);

  return ref.current;
};
