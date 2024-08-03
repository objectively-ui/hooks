import { mapObject } from "./mapObject";
import type { UnknownRecord } from "./types";

export const deepClone = <TValue>(value: TValue): TValue => {
  if (Array.isArray(value)) {
    return value.map(deepClone) as TValue;
  }

  if (typeof value === "object" && !(value instanceof Promise)) {
    return mapObject(value as UnknownRecord, (_k, v) => deepClone(v)) as TValue;
  }

  return value;
};
