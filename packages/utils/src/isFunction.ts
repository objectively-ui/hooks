export const isFunction = <TReturn = unknown>(
  value: unknown,
): value is (...args: unknown[]) => TReturn => {
  return typeof value === "function";
};
