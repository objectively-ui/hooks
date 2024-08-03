export const isPromise = (value: unknown) => {
  return value && typeof value === "object" && "then" in value && typeof value.then === "function";
};
