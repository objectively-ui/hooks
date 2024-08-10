import { isFunction } from "@objectively/utils";
import type { Atom } from "@objectively/utils/atom";
import React, { type Dispatch, type SetStateAction, useCallback } from "react";
import { useEventListener } from "../useEventListener";
import { useRerender } from "../useRerender";

const useAtomSuspense = (atom: Atom<unknown, string>) => {
  const promise = atom.asPromise();

  // React next supports the `use` hook, which is the new way of suspending
  if ("use" in React && React.use && isFunction(React.use)) {
    React.use(promise);
  } else {
    // Older versions suspend by throwing a promise
    if (atom.resolved) {
      return;
    }
    throw promise;
  }
};

export const useAtomState = <TValue, TName extends string = string>(
  atom: Atom<TValue, TName>,
): [TValue | undefined, Dispatch<SetStateAction<TValue>>] => {
  const value = atom.value;
  useAtomSuspense(atom);
  const rerender = useRerender();

  const setValue = useCallback(
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

  useEventListener("change", rerender, {
    eventTarget: atom,
    passive: true,
  });

  return [value, setValue];
};
