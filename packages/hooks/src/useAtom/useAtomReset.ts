import type { Atom } from "@objectively/utils/atom";

export const useAtomReset = <TValue, TName extends string = string>(
  atom: Atom<TValue, TName>,
): VoidFunction => {
  return () => atom.reset();
};
