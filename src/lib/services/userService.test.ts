import fs from "fs";
import localFileService from "./localFileService";
import userService, { userMetaService } from "./userService";
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
	it("Creates users", async () => {
		let fileService = await localFileService("test-files/app", "json");
		let service = await userService(fileService);
		let users = await service.fetchUsers();
		expect(Object.keys(users).length).toEqual(1);
		let user = await service.createUser("test@email.com", "password");
		expect(user.hashedPassword !== "password").toBeTruthy();
		expect(user.data.encryptionKey.length).toEqual(42);

		users = await service.fetchUsers();
		expect(Object.keys(users).length).toEqual(2);

		expect(Object.values(users)[0].data.hasOwnProperty("iv")).toBeFalsy();
		let _users = fs.readFileSync(`${process.cwd()}/test-files/app/users.json`);
		_users = JSON.parse(_users.toString());
		expect(Object.keys(_users).length).toBe(2);
		//@ts-ignore
		expect(Object.values(_users)[0].data.hasOwnProperty("iv")).toBeTruthy();
		//@ts-ignore
		expect(Object.values(_users)[0].data.hasOwnProperty("email")).toBeFalsy();
	});

	it("Decrypts created user", async () => {
		let fileService = await localFileService("test-files/app", "json");
		let service = await userService(fileService);
		await service.fetchUsers();
		let user1 = await service.createUser("22@one.com", "password");
		expect(user1.data.meta).toEqual({});

		//reload
		fileService = await localFileService("test-files/app", "json");
		service = await userService(fileService);
		await service.fetchUsers();
		let user2 = service.getUser("22@one.com");
		//Should be same user, with same key
		expect(user1.data.encryptionKey).toEqual(user2.data.encryptionKey);
		expect(user1.data.meta).toEqual(user2.data.meta);
	});

	it("works with user meta util", async () => {
		let fileService = await localFileService("test-files/app", "json");
		let _userService = await userService(fileService);
		await _userService.fetchUsers();
		let user1 = await _userService.createUser("22@one.com", "password");
		await _userService.fetchUsers();

		let metaService = await userMetaService(user1, _userService);

		await metaService.saveMeta("roy", "hello");
		await metaService.saveMeta("r2", "t2");

		let value = await metaService.getMeta("roy");
		expect(value).toEqual("hello");
	});
});
