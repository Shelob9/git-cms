import { checkPassword, hashPassword } from "./password";
describe("password", () => {
	it("hashes and checks password", async () => {
		let password = "1sfl1";
		let hash = await hashPassword(password);
		let valid = await checkPassword(password, hash);
		expect(valid).toBeTruthy();
	});
	it("Fails for invalid passwords", async () => {
		let hash = await hashPassword("something");
		let notValid = await checkPassword("something elese", hash);
		expect(notValid).toBeFalsy(); //returned false, didn't throw
	});
});
