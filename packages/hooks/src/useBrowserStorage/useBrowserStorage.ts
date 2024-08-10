import { isSSR, window } from "@objectively/utils";
import { useCallback, useState } from "react";
import { useEventListener } from "../useEventListener";
import type {
  Deserializer,
  Serializer,
  StorableRecord,
  UseBrowserStorageOptions,
  UseBrowserStorageReturn,
} from "./types";

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

    result[key] = deserialize(key, storage.getItem(key) || "");
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
        if (keys && !keys.includes(key)) {
          throw new Error(
            `The key "${key}" is not in the provided keys filter. Expected one of ${keys.join(", ")}`,
          );
        }
        setValue(key, undefined);
      } else if (keys) {
        for (const key of keys) {
          setValue(key, undefined);
        }
      } else {
        setData({});
        storage?.clear();
      }
    },
    [storage, setValue, keys],
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
