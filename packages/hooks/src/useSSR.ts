import { isSSR } from "@objectively/utils";

export const useSSR = (): boolean => {
  return isSSR;
};
