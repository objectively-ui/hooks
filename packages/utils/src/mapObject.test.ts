import { mapObject } from "./mapObject";

describe("#mapObject", () => {
  it("runs a function for every key in obj", () => {
    const func = vitest.fn().mockImplementation((k, v) => k + v);
    const obj = { a: 1, b: 2, c: 3 };

    const res = mapObject(obj, func);

    expect(func).toBeCalledTimes(3);
    expect(res).toEqual({ a: "a1", b: "b2", c: "c3" });
  });
});
