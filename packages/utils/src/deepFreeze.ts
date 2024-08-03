import { mapObject } from "./mapObject";
import type { UnknownRecord } from "./types";

export const deepFreeze = <TValue>(value: TValue): TValue => {
  if (Array.isArray(value)) {
    return Object.freeze(value.map(deepFreeze) as TValue);
  }

  if (value && typeof value === "object" && !(value instanceof Promise)) {
    return Object.freeze(mapObject(value as UnknownRecord, (_k, v) => deepFreeze(v)) as TValue);
  }

  return value;
};
