import { unwrapObjectGetters } from "./unwrapObjectGetters";

export const safeStringify = (
  obj: unknown,
  spaces = 0,
  circularReplacement: string | undefined = "[circular]",
) => {
  const seen = new WeakSet();

  return JSON.stringify(
    obj,
    (_, v) => {
      if (v !== null && typeof v === "object") {
        if (seen.has(v)) {
          return circularReplacement;
        }

        seen.add(v);

        return unwrapObjectGetters(v);
      }

      return v;
    },
    spaces,
  );
};
