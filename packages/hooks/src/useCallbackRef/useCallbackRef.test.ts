import { renderHook } from "@testing-library/react";
import { useCallbackRef } from "./useCallbackRef";

describe("#useCallbackRef", () => {
  it("returns a ref to a function", () => {
    const initialFunc = vitest.fn();
    const nextFunc = vitest.fn();

    const { result, rerender } = renderHook((func) => useCallbackRef(func), {
      initialProps: initialFunc,
    });

    expect(initialFunc).toBeCalledTimes(0);
    const initialRef = result.current;

    result.current.current();
    expect(initialFunc).toBeCalledTimes(1);

    rerender(nextFunc);

    result.current.current();
    expect(initialFunc).toBeCalledTimes(1);
    expect(nextFunc).toBeCalledTimes(1);

    expect(initialRef).toBe(result.current);
  });
});
