import { isFunction } from "@objectively/utils";
import type { Atom } from "@objectively/utils/atom";
import { type Dispatch, type SetStateAction, useCallback } from "react";

export const useSetAtomState = <TValue, TName extends string = string>(
  atom: Atom<TValue, TName>,
): Dispatch<SetStateAction<TValue>> => {
  return useCallback(
    (setterOrUpdater: SetStateAction<TValue>) => {
      if (isFunction<TValue>(setterOrUpdater)) {
        const res = setterOrUpdater(atom.value);
        atom.setValue(res);
      } else {
        atom.setValue(setterOrUpdater as TValue);
      }
    },
    [atom],
  );
};
