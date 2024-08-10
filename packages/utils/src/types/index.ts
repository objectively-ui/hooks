export type UnknownRecord = Record<string, unknown>;
export type PlainValue = string | number | boolean;
export type PlainRecord = Record<string, PlainValue>;

export type UnknownFunction<TPromise extends boolean = false> = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ...args: any[]
) => TPromise extends true ? Promise<void> : void;

export type FlattenedObjectKeys<T extends UnknownRecord, K = keyof T> = K extends string
  ? T[K] extends UnknownRecord
    ? `${K}.${FlattenedObjectKeys<T[K]>}`
    : `${K}`
  : never;
