import fs from "fs";
import applicationService from "./applicationService";

describe("applicationService", () => {
	beforeEach(() => {
		fs.copyFileSync(
			`${process.cwd()}/test-files/app/_users.json`,
			`${process.cwd()}/test-files/app/users.json`
		);
	});
	it("Doesn't make errors when created", async () => {
		let service = await applicationService("test-files/app", [], false);
		expect(typeof service).toBe("object");
	});
	it("Uses the right type of git service", async () => {
		let service = await applicationService("test-files/app", [], false);
		expect(service.useGit).toBe(false);
	});
	it("sets current user", async () => {
		let service = await applicationService("test-files/app", [], false);
		await service.userService.fetchUsers();
		let user = await service.userService.createUser(
			"test@email.com",
			"password"
		);

		expect(typeof user).toEqual("object");
		await service.setCurrentUser(user);
		expect(user).toEqual(service.currentUser);
	});

	it("sets/ gets current user meta", async () => {
		let service = await applicationService("test-files/app", [], false);
		let user = await service.userService.createUser(
			"test2@email.com",
			"password"
		);

		await service.setCurrentUser(user);
		expect(typeof service.currentUser).toEqual("object");

		expect(typeof service.currentUserMeta).toEqual("object");
		await service.currentUserMeta.saveMeta("doggo", "puppers");

		let value = await service.currentUserMeta.getMeta("doggo");
		expect(value).toEqual("puppers");

		service = await applicationService("test-files/app", [], false);
		await service.userService.fetchUsers();
		user = service.userService.getUser("test2@email.com");
		await service.setCurrentUser(user);
		value = await service.currentUserMeta.getMeta("doggo");
		expect(value).toEqual("puppers");
	});
});
