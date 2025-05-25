import { URLENCODE } from "./urlencode";

describe("URLENCODE", () => {
	describe("stringify and parse", () => {
		it("should encode and decode null", () => {
			const value = null;
			const encoded = URLENCODE.stringify(value);
			expect(encoded).toBe("!n");
			expect(URLENCODE.parse(encoded)).toBe(null);

			expect(encoded).toMatchSnapshot();
		});

		it("should encode and decode booleans", () => {
			expect(URLENCODE.parse(URLENCODE.stringify(true))).toBe(true);
			expect(URLENCODE.parse(URLENCODE.stringify(false))).toBe(false);

			expect(URLENCODE.stringify(true)).toMatchSnapshot();
			expect(URLENCODE.stringify(false)).toMatchSnapshot();
		});

		it("should encode and decode numbers", () => {
			expect(URLENCODE.parse(URLENCODE.stringify(42))).toBe(42);
			expect(URLENCODE.parse(URLENCODE.stringify(-3.14))).toBe(-3.14);

			expect(URLENCODE.stringify(42)).toMatchSnapshot();
			expect(URLENCODE.stringify(-3.14)).toMatchSnapshot();
		});

		it("should encode and decode strings", () => {
			expect(URLENCODE.parse(URLENCODE.stringify("hello"))).toBe("hello");
			expect(URLENCODE.parse(URLENCODE.stringify("!,:["))).toBe("!,:[");

			expect(URLENCODE.stringify("hello")).toMatchSnapshot();
			expect(URLENCODE.stringify("!,:[")).toMatchSnapshot();
		});

		it("should encode and decode arrays", () => {
			const arr = [1, "two", false, null];
			const encoded = URLENCODE.stringify(arr);
			expect(URLENCODE.parse(encoded)).toEqual(arr);
			expect(encoded).toMatchSnapshot();
		});

		it("should encode and decode nested arrays", () => {
			const arr = [1, [2, [3, null]], "test"];
			const encoded = URLENCODE.stringify(arr);
			expect(URLENCODE.parse(encoded)).toEqual(arr);
			expect(encoded).toMatchSnapshot();
		});

		it("should encode and decode objects", () => {
			const obj = { a: 1, b: "two", c: false, d: null };
			const encoded = URLENCODE.stringify(obj);
			expect(URLENCODE.parse(encoded)).toEqual(obj);
			expect(encoded).toMatchSnapshot();
		});

		it("should encode and decode nested objects", () => {
			const obj = { a: { b: { c: [1, 2, 3] } }, d: "test" };
			const encoded = URLENCODE.stringify(obj);
			expect(URLENCODE.parse(encoded)).toEqual(obj);
			expect(encoded).toMatchSnapshot();
		});

		it("should encode and decode complex structures", () => {
			const value = {
				arr: [1, { foo: "bar", baz: [true, false, null] }],
				str: "hello,world!",
				num: 123,
				bool: true,
				nil: null,
			};
			const encoded = URLENCODE.stringify(value);
			expect(URLENCODE.parse(encoded)).toEqual(value);
			expect(encoded).toMatchSnapshot();
		});

		it("should handle empty array and object", () => {
			expect(URLENCODE.parse(URLENCODE.stringify([]))).toEqual([]);
			expect(URLENCODE.parse(URLENCODE.stringify({}))).toEqual({});
			expect(URLENCODE.stringify([])).toMatchSnapshot();
			expect(URLENCODE.stringify({})).toMatchSnapshot();
		});

		it("should escape and unescape special characters in keys and values", () => {
			const obj = { "!key,:[": "!value,:[" };
			const encoded = URLENCODE.stringify(obj);
			expect(URLENCODE.parse(encoded)).toEqual(obj);
			expect(encoded).toMatchSnapshot();
		});
	});
});
