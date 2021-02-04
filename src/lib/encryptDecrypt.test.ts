import { encrypt, decrypt } from "./encryptDecrypt";
describe("encrypt, decrypt", () => {
	it("encrypts", () => {
		let hash = encrypt("Hi Roy");
		expect(hash.hasOwnProperty("iv")).toBeTruthy();
		expect(hash.hasOwnProperty("content")).toBeTruthy();
	});

	it("decrypts", () => {
		expect(decrypt(encrypt("Hi Roy"))).toEqual("Hi Roy");
	});

	it("Requires valid iv", () => {
		let hash = encrypt("Hi Roy");
		hash.iv = "1234567890123456789012";
		expect(decrypt(hash)).toBeFalsy();
	});
});
