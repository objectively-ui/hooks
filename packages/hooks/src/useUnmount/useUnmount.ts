import type { UnknownFunction } from "@objectively/utils";
import { useEffect } from "react";
import { useCallbackRef } from "../useCallbackRef";

export const useUnmount = (func: UnknownFunction): void => {
  const funcRef = useCallbackRef(func);

  useEffect(() => {
    return () => {
      funcRef.current();
    };
  }, []);
};
