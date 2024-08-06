import { safeStringify } from "./json";

describe("json", () => {
  describe("#safeStringify", () => {
    it("stringifies json", () => {
      expect(safeStringify({ a: 1, b: 2 })).toEqual(JSON.stringify({ a: 1, b: 2 }));
    });

    it("stringifies json with spaces", () => {
      expect(safeStringify({ a: 1, b: 2 }, 2)).toEqual(JSON.stringify({ a: 1, b: 2 }, null, 2));
    });

    it("stringifies circular objects", () => {
      const obj1 = { obj2: undefined };
      const obj2 = { obj1 };
      // @ts-ignore
      obj1.obj2 = obj2;

      const res = safeStringify(obj1, 0, "[circular]");

      expect(res).toEqual(JSON.stringify({ obj2: { obj1: "[circular]" } }));
    });
  });
});
