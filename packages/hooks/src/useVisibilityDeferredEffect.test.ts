import { renderHook } from "@testing-library/react";
import { useVisibilityDeferredEffect } from "./useVisibilityDeferredEffect";
import * as visibilityHooks from "./usePageVisibility";

let visible = true;

vitest.spyOn(visibilityHooks, "usePageVisibility").mockImplementation(() => ({
	visible,
}));

describe("#useVisibilityDeferredEffect", () => {
	beforeEach(() => {
		visible = true;
	});

	it("behaves like useEffect if the page is visible", () => {
		const effect = vitest.fn();
		const { rerender } = renderHook(
			(props) => useVisibilityDeferredEffect(effect, props.deps),
			{
				initialProps: {
					deps: [1],
				},
			},
		);

		expect(effect).toBeCalledTimes(1);

		rerender({ deps: [2] });

		expect(effect).toBeCalledTimes(2);
	});

	it("does not trigger the effect until the page becomes visible", () => {
		const effect = vitest.fn();
		visible = false;

		const { rerender } = renderHook(
			(props) => useVisibilityDeferredEffect(effect, props.deps),
			{
				initialProps: {
					deps: [1],
				},
			},
		);

		expect(effect).toBeCalledTimes(0);

    rerender({ deps: [2] })

		expect(effect).toBeCalledTimes(0);

		visible = true;
    rerender({ deps: [2] })

    expect(effect).toBeCalledTimes(1)
	});

  it('behaves like useEffect once the page becomes visible for the first time', () => {
    const effect = vitest.fn();
		visible = false;

		const { rerender } = renderHook(
			(props) => useVisibilityDeferredEffect(effect, props.deps),
			{
				initialProps: {
					deps: [1],
				},
			},
		);

		visible = true;
    rerender({ deps: [1] })

    expect(effect).toBeCalledTimes(1)

		visible = false;
    rerender({ deps: [1] })
    expect(effect).toBeCalledTimes(1)

    rerender({ deps: [2] })
    expect(effect).toBeCalledTimes(2)
  })
});
