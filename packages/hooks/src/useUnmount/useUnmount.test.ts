import { renderHook } from "@testing-library/react";
import { useUnmount } from "./useUnmount";

describe("#useUnmount", () => {
  it("calls the callback on unmount", () => {
    const func = vitest.fn();
    const { unmount, rerender } = renderHook(() => useUnmount(func));

    rerender(func);

    expect(func).toBeCalledTimes(0);

    unmount();

    expect(func).toBeCalledTimes(1);
  });
});
