import { document } from "@objectively/utils";
import { act, renderHook } from "@testing-library/react";
import { usePageVisibility } from "./usePageVisibility";

let hidden = false;

const addEventListenerSpy = vitest
  .spyOn(document, "addEventListener")
  .mockImplementation(vitest.fn());
vitest.spyOn(document, "hidden", "get").mockImplementation(() => hidden);

describe("#usePageVisibility", () => {
  beforeEach(() => {
    hidden = false;

    addEventListenerSpy.mockReset();
  });

  it.each([
    [true, "is not", false],
    [false, "is", true],
  ])("returns %s if the page %s visible", (isHidden, _, expected) => {
    hidden = isHidden;

    const { result } = renderHook(() => usePageVisibility());

    expect(result.current.visible).toBe(expected);
  });

  it("changes when the page visibility changes", () => {
    hidden = true;
    const { result, rerender } = renderHook(() => usePageVisibility());

    expect(result.current.visible).toBe(false);

    hidden = false;
    act(() => {
      (addEventListenerSpy.mock.lastCall?.at(1) as () => void)?.();
    });
    rerender();

    expect(result.current.visible).toBe(true);
  });
});
