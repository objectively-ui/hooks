import { type Atom, atom } from "@objectively/utils";

const atoms = new Map<string, Atom<unknown, string>>();

export const useAtom = <TValue, TName extends string = string>(
  name: TName,
  initialValue: TValue,
): Atom<TValue, TName> => {
  if (atoms.has(name)) {
    return atoms.get(name) as Atom<TValue, TName>;
  }

  const newAtom = atom<TValue, TName>(name, {
    defaultValue: initialValue,
  });
  atoms.set(name, newAtom);

  return newAtom;
};
