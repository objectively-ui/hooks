import { isFunction } from "@objectively/utils";
import type { Atom } from "@objectively/utils/atom";
import React, { type Dispatch, type SetStateAction } from "react";
import { useEventListener } from "../useEventListener";
import { useRerender } from "../useRerender";
import { useSetAtomState } from "./useSetAtomState";

export const useAtomState = <TValue, TName extends string = string>(
  atom: Atom<TValue, TName>,
): [TValue | undefined, Dispatch<SetStateAction<TValue>>] => {
  useAtomSuspense(atom);
  const rerender = useRerender();
  const setValue = useSetAtomState(atom);

  useEventListener("change", rerender, {
    eventTarget: atom,
    passive: true,
  });

  return [atom.value, setValue];
};

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
