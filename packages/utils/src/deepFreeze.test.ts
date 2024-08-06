import { deepFreeze } from "./deepFreeze";

describe("#deepFreeze", () => {
  it("freezes an object", () => {
    const frozen = deepFreeze({ a: 1 });

    expect(Object.isFrozen(frozen)).toBeTruthy();
  });

  it("freezes nested objects", () => {
    const frozen = deepFreeze({ a: { b: 2 } });

    expect(Object.isFrozen(frozen.a)).toBeTruthy();
  });

  it("freezes arrays", () => {
    const frozen = deepFreeze(["a"]);

    expect(Object.isFrozen(frozen)).toBeTruthy();
  });

  it("freezes nested arrays", () => {
    const frozen = deepFreeze([{ a: [{ b: 2 }] }]);

    expect(Object.isFrozen(frozen[0])).toBeTruthy();
    expect(Object.isFrozen(frozen[0]?.a)).toBeTruthy();
    expect(Object.isFrozen(frozen[0]?.a[0])).toBeTruthy();
    expect(Object.isFrozen(frozen[0]?.a[0]?.b)).toBeTruthy();
  });
});
