import { mapObject } from "./mapObject";
import type { UnknownRecord } from "./types";

export const unwrapObjectGetters = <T extends UnknownRecord>(obj: T): T => {
  return mapObject(obj, (_, v) => v);
};
