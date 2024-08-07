import { debounce } from "./debounce";

describe("#debounce", () => {
  beforeEach(() => {
    vitest.useFakeTimers();
  });

  it("debounces a function", () => {
    const originalFunc = vitest.fn();
    const func = debounce(originalFunc, 5);

    func();
    vitest.advanceTimersByTime(2);
    func();

    vitest.advanceTimersByTime(2);
    expect(originalFunc).toBeCalledTimes(0);

    vitest.advanceTimersByTime(4);
    expect(originalFunc).toBeCalledTimes(1);

    vitest.advanceTimersByTime(10);
    expect(originalFunc).toBeCalledTimes(1);
  });
});
