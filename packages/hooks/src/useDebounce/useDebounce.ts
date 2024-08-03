import { type UnknownFunction, debounce } from "@objectively/utils";
import { useEffect, useRef } from "react";
import { useCallbackRef } from "../useCallbackRef";

export const useDebounce = <TFunc extends UnknownFunction>(func: TFunc, delay: number): TFunc => {
  const funcRef = useCallbackRef(func);
  const ref = useRef(debounce(((...args) => funcRef.current(...args)) as TFunc, delay));

  useEffect(() => {
    ref.current = debounce(((...args) => funcRef.current(...args)) as TFunc, delay);
  }, [delay]);

  return ref.current;
};
