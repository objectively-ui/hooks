import { mapObject } from "./mapObject";
import type { UnknownRecord } from "./types";

export const deepFreeze = <TValue>(value: TValue): TValue => {
  const seen = new WeakSet();

  const innerFreeze: typeof deepFreeze = (value) => {
    if (value && typeof value === "object") {
      if (seen.has(value)) {
        return value;
      }

      seen.add(value);
    }

    if (Array.isArray(value)) {
      return Object.freeze(value.map(innerFreeze) as TValue);
    }

    if (value && typeof value === "object" && !(value instanceof Promise)) {
      return Object.freeze(mapObject(value as UnknownRecord, (_k, v) => innerFreeze(v)) as TValue);
    }

    return value;
  };

  return innerFreeze(value);
};
