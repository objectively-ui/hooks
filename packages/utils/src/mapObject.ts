import type { UnknownRecord } from "./types";

export const mapObject = <
  TObj extends UnknownRecord,
  TReturn extends UnknownRecord = TObj,
  TFunc extends (key: keyof TObj, value: unknown) => unknown = (
    key: keyof TObj,
    value: unknown,
  ) => unknown,
>(
  obj: TObj,
  func: TFunc,
): TReturn => {
  const res = {} as UnknownRecord;

  for (const [k, v] of Object.entries(obj)) {
    res[k] = func(k, v);
  }

  return res as TReturn;
};
