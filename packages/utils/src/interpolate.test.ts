import { interpolate } from "./interpolate";

describe("#interpolate", () => {
  it("returns a string with no replacements", () => {
    expect(interpolate("hello world")).toBe("hello world");
  });

  it("returns a string without any replacement", () => {
    expect(interpolate("the count is {{ count }}")).toBe("the count is {{ count }}");
  });

  it("returns a string with 1 replacement", () => {
    expect(interpolate("the count is {{ count }}", { count: 1 })).toBe("the count is 1");
  });

  it("returns a string with multiple replacements", () => {
    expect(interpolate("the count is {{ count }} {{ unit }}s", { count: 5, unit: "meter" })).toBe(
      "the count is 5 meters",
    );
  });

  it("returns a string with multiples of 1 replacement", () => {
    expect(interpolate("the {{ thing }} is a {{ thing }}.", { thing: "cat" })).toBe(
      "the cat is a cat.",
    );
  });
});
