import { type PlainValue, type UnknownRecord, window } from "@objectively/utils";
import { isSSR } from "@objectively/utils/ssr";
import { useCallback, useState } from "react";
import { useEventListener } from "./useEventListener";

export type StorableValue = PlainValue | Record<string, PlainValue> | PlainValue[];
type StorableRecord = Record<string, StorableValue>;

type Serializer<TData extends UnknownRecord = UnknownRecord> = <
  TKey extends string & keyof TData,
  TValue extends TData[TKey],
>(
  key: TKey,
  value: TValue,
) => string;
type Deserializer<TData extends UnknownRecord = UnknownRecord> = <
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

interface UseBrowserStorageReturn<TData extends StorableRecord> {
  data: Partial<TData>;
  setValue: <TKey extends string & keyof TData>(key: TKey, value: TData[TKey] | undefined) => void;
  clear: (key?: string & keyof TData) => void;
}

const readStorage = <TResult>(
  storage: Storage,
  keys: string[] | undefined,
  deserialize: Deserializer,
) => {
  const result: StorableRecord = {};

  for (let i = 0; i < storage.length; ++i) {
    const key = storage.key(i) as string;

    if (keys && !keys.includes(key)) {
      continue;
    }

    result[key] = deserialize(key, storage[i]);
  }

  return result as TResult;
};

const defaultSerializer: Serializer = (_k, v) => JSON.stringify(v);
const defaultDeserializer: Deserializer = (_k, v) => JSON.parse(v);

export const useBrowserStorage = <TData extends StorableRecord>(
  opts: UseBrowserStorageOptions<TData> = {},
): UseBrowserStorageReturn<TData> => {
  const storage = isSSR
    ? undefined
    : opts.storage === "local"
      ? window.localStorage
      : opts.storage === "session"
        ? window.sessionStorage
        : opts.storage ?? window.localStorage;
  const { keys, serializeValue = defaultSerializer, deserializeValue = defaultDeserializer } = opts;

  const [data, setData] = useState<Partial<TData>>(
    storage ? readStorage<TData>(storage, keys, deserializeValue) : {},
  );

  const setValue = useCallback(
    <TKey extends string & keyof TData>(key: TKey, value: TData[TKey] | undefined) => {
      setData((current) => {
        const newValue = { ...current };

        if (value == null) {
          delete newValue[key];
          storage?.removeItem(key);
        } else {
          newValue[key] = value;
          storage?.setItem(key, serializeValue(key, value));
        }

        return newValue;
      });
    },
    [storage, serializeValue],
  );

  const clear = useCallback(
    (key?: string & keyof TData) => {
      if (key) {
        setValue(key, undefined);
      } else {
        setData({});
        storage?.clear();
      }
    },
    [storage, setValue],
  );

  useEventListener(
    "storage",
    (e) => {
      if (e.storageArea !== storage) {
        return;
      }

      if (e.key === null) {
        clear();
      } else {
        if (keys && !keys.includes(e.key)) {
          return;
        }

        if (e.newValue === null) {
          clear(e.key);
        } else {
          setValue(e.key, deserializeValue(e.key, e.newValue));
        }
      }
    },
    {
      eventTarget: window,
      passive: true,
    },
  );

  return {
    data,
    setValue,
    clear,
  };
};

export const useLocalStorage = <TData extends StorableRecord>(
  opts: Omit<UseBrowserStorageOptions<TData>, "storage"> = {},
): UseBrowserStorageReturn<TData> => {
  return useBrowserStorage({
    ...opts,
    storage: "local",
  });
};

export const useSessionStorage = <TData extends StorableRecord>(
  opts: Omit<UseBrowserStorageOptions<TData>, "storage"> = {},
): UseBrowserStorageReturn<TData> => {
  return useBrowserStorage({
    ...opts,
    storage: "session",
  });
};
