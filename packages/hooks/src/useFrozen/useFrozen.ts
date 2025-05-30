import { deepFreeze, safeStringify } from "@objectively/utils";
import { useMemo } from "react";

export const useFrozen = <TValue>(value: TValue, deep = true): Readonly<TValue> => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  return useMemo(
    () => (deep ? deepFreeze(value) : Object.freeze(value)),
    [deep, safeStringify(value, undefined)],
  );
};
