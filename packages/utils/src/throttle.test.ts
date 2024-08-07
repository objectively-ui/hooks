import { throttle } from "./throttle";

describe("#throttle", () => {
  beforeEach(() => {
    vitest.useFakeTimers();
  });

  it("throttles a function", () => {
    const originalFunc = vitest.fn();
    const func = throttle(originalFunc, 5);

    func();
    vitest.advanceTimersByTime(2);
    func();
    func();
    vitest.advanceTimersByTime(2);
    expect(originalFunc).toBeCalledTimes(1);
    vitest.advanceTimersByTime(4);
    func();
    expect(originalFunc).toBeCalledTimes(2);
    vitest.advanceTimersByTime(10);
    expect(originalFunc).toBeCalledTimes(2);
  });
});
