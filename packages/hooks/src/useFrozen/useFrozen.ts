import { deepFreeze } from "@objectively/utils";
import { safeStringify } from "@objectively/utils/json";
import { useMemo } from "react";

export const useFrozen = <TValue>(value: TValue, deep = true): TValue => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  return useMemo(
    () => (deep ? deepFreeze(value) : Object.freeze(value)),
    [deep, safeStringify(value, undefined)],
  );
};
