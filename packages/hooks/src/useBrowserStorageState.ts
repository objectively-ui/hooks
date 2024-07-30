import { type Dispatch, type SetStateAction, useCallback } from "react";
import {
  type StorableValue,
  useBrowserStorage,
  type UseBrowserStorageOptions,
} from "./useBrowserStorage";

interface UseBrowserStorageStateOptions<TValue> extends Omit<UseBrowserStorageOptions, "keys"> {
  defaultValue?: TValue;
}

export const useBrowserStorageState = <TValue extends StorableValue>(
  key: string,
  opts: UseBrowserStorageStateOptions<TValue> = {},
): [TValue, Dispatch<SetStateAction<TValue>>] => {
  const storage = useBrowserStorage({
    serializeValue: opts.serializeValue,
    deserializeValue: opts.deserializeValue,
    storage: opts.storage,
    keys: [key],
  });

  const { defaultValue } = opts;

  const value = (storage.data[key] ?? defaultValue) as TValue;

  const setValue = useCallback<Dispatch<SetStateAction<TValue>>>(
    (setterOrValue) => {
      if (typeof setterOrValue === "function") {
        storage.setValue(key, setterOrValue(value));
      } else {
        storage.setValue(key, setterOrValue);
      }
    },
    [key, value, storage.setValue],
  );

  return [value, setValue];
};

export const useLocalStorageState = <TValue extends StorableValue>(
  key: string,
  opts: Omit<UseBrowserStorageStateOptions<TValue>, "storage"> = {},
): [TValue, Dispatch<SetStateAction<TValue>>] => {
  return useBrowserStorageState(key, { ...opts, storage: "local" });
};

export const useSessionStorageState = <TValue extends StorableValue>(
  key: string,
  opts: Omit<UseBrowserStorageStateOptions<TValue>, "storage"> = {},
): [TValue, Dispatch<SetStateAction<TValue>>] => {
  return useBrowserStorageState(key, { ...opts, storage: "session" });
};
