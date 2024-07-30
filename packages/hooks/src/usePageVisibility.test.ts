import { usePageVisibility } from "./usePageVisibility";
import { act, renderHook } from "@testing-library/react";
import * as globals from "./utils/globals";

let hidden = false;

const addEventListenerSpy = vitest.fn();

vitest.spyOn(globals, "document", "get").mockImplementation(() => {
	return {
		...document,
		addEventListener: addEventListenerSpy,
		removeEventListener: vitest.fn(),
		hidden,
	};
});

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

	it("calls onVisibilityChange when the page visibility changes", () => {
		hidden = true;
		const changeSpy = vitest.fn();

		const { result, rerender } = renderHook((opts) => usePageVisibility(opts), {
			initialProps: { onVisibilityChange: changeSpy },
		});

		expect(changeSpy).toBeCalledTimes(0);
		expect(result.current.visible).toBe(false);

		hidden = false;
		act(() => {
			addEventListenerSpy.mock.lastCall?.at(1)?.();
		});
		rerender();

		expect(changeSpy).toBeCalledTimes(1);
		expect(result.current.visible).toBe(true);
	});
});
