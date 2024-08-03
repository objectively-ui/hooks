import type { UseBrowserStorageOptions } from "../useBrowserStorage";

export interface UseBrowserStorageStateOptions<TValue>
  extends Omit<UseBrowserStorageOptions, "keys"> {
  defaultValue?: TValue;
}
