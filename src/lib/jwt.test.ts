import { decodeJwtToken, createJwtToken } from "./jwt";

describe("jwt", () => {
	let data = { hi: "Roy" };

	it("Makes tokens", () => {
		expect(typeof createJwtToken(data)).toBe("string");
	});

	it("Decodes tokens", () => {
		expect(decodeJwtToken(createJwtToken(data))).toEqual(data);
	});

	it("Returns false for invalid token", () => {
		expect(decodeJwtToken("space turtles down to invisible turtles")).toEqual(
			false
		);
	});
});
