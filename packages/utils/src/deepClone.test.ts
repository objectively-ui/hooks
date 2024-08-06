import { deepClone } from "./deepClone";

describe("#deepClone", () => {
  it("clones objects", () => {
    const obj = { a: 1 };
    const clone = deepClone(obj);

    expect(clone).not.toBe(obj);
    expect(clone).toEqual(obj);
  });

  it("clones nested objects", () => {
    const obj = { a: { b: 2 } };
    const clone = deepClone(obj);

    expect(clone.a).not.toBe(obj.a);
    expect(clone.a).toEqual(obj.a);
  });

  it("clones arrays", () => {
    const obj = ["a"];
    const clone = deepClone(obj);

    expect(clone).not.toBe(obj);
    expect(clone).toEqual(obj);
  });

  it("clones nested arrays", () => {
    const obj = [{ a: [{ b: 2 }] }];
    const clone = deepClone(obj);

    expect(clone[0]?.a[0]).not.toBe(obj[0]?.a[0]);
    expect(clone[0]?.a[0]).toEqual(obj[0]?.a[0]);
  });
});
