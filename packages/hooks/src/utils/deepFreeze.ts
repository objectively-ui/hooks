import type { UnknownRecord } from "../types";
import { mapObject } from "./mapObject";

export const deepFreeze = <TValue>(value: TValue): TValue => {
  if (Array.isArray(value)) {
    return Object.freeze(value.map(deepFreeze) as TValue);
  }

  if (typeof value === "object") {
    return Object.freeze(mapObject(value as UnknownRecord, (_k, v) => deepFreeze(v)) as TValue);
  }

  return value;
};
