import type { PlainValue, UnknownRecord } from "@objectively/utils";

export type StorableValue = PlainValue | Record<string, PlainValue> | PlainValue[] | undefined;
export type StorableRecord = Record<string, StorableValue>;

export type Serializer<TData extends UnknownRecord = UnknownRecord> = <
  TKey extends string & keyof TData,
  TValue extends TData[TKey],
>(
  key: TKey,
  value: TValue,
) => string;

export type Deserializer<TData extends UnknownRecord = UnknownRecord> = <
  TKey extends string & keyof TData,
  TValue extends TData[TKey],
>(
  key: TKey,
  value: string,
) => TValue;

export interface UseBrowserStorageOptions<TData extends StorableRecord = StorableRecord> {
  storage?: "local" | "session" | Storage;
  keys?: (string & keyof TData)[];
  serializeValue?: Serializer<TData>;
  deserializeValue?: Deserializer<TData>;
}

export interface UseBrowserStorageReturn<TData extends StorableRecord> {
  data: Partial<TData>;
  setValue: <TKey extends string & keyof TData>(key: TKey, value: TData[TKey] | undefined) => void;
  clear: (key?: string & keyof TData) => void;
}
