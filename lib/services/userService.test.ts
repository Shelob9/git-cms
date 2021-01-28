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
	it("updates users", async () => {
		let fileService = await localFileService("test-files/app", "json");
		let service = await userService(fileService);
		await service.fetchUsers();

		let users = await service.updateUser({
			email: "two@email.com",
		});
		expect(Object.keys(users).length).toEqual(2);
	});
});
