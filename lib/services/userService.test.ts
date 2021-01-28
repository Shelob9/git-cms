import fs from "fs";
import localFileService from "./localFileService";
import userService from "./userService";
describe("userSeuserServicervice", () => {
	beforeEach(() => {
		fs.copyFileSync(
			`${process.cwd()}/test-files/app/_users.json`,
			`${process.cwd()}/test-files/app/users.json`
		);
	});
	it("gets users", async () => {
		let fileService = await localFileService("test-files/app", "json");
		let service = await userService(fileService);
		let users = await service.fetchUsers();
		expect(Object.keys(users).length).toEqual(1);
	});
	it("Creates  users", async () => {
		let fileService = await localFileService("test-files/app", "json");
		let service = await userService(fileService);
		//let users = await service.updateUser({ email: "two@email.com" });
		let users = await service.fetchUsers();
		expect(Object.keys(users).length).toEqual(1);
		let user = await service.createUser("two@email.com", "whatever");
		expect(user.hashedPassword !== "whatever").toBeTruthy();
		users = await service.fetchUsers();
		expect(Object.keys(users).length).toEqual(2);
		await service.updateUser({ email: "two@" });
	});
});
