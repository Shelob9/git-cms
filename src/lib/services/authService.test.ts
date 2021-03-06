import fs from "fs";
import authService from "./authService";
import localFileService from "./localFileService";
import userService from "./userService";

describe("Auth service", () => {
	beforeEach(async () => {
		fs.copyFileSync(
			`${process.cwd()}/test-files/app/_users.json`,
			`${process.cwd()}/test-files/app/users.json`
		);
	});

	it("creates and validates a session", async () => {
		let fileService = await localFileService("test-files/app", "json");
		let theUserService = await userService(fileService);
		theUserService.fetchUsers();
		let user = await theUserService.createUser("test@email.com", "password");
		let theAuthService = await authService(theUserService, []);
		let session = await theAuthService.startUserSession(user);
		let valid = await theAuthService.validateSessionToken(
			session.sessionId,
			session.jwt
		);
		expect(valid).toBeTruthy();
		expect(
			await theAuthService.validateSessionToken("not correct", session.jwt)
		).toBeFalsy();
	});

	it("validates invite codes", async () => {
		let fileService = await localFileService("test-files/app", "json");
		let theUserService = await userService(fileService);
		theUserService.fetchUsers();
		let theAuthService = await authService(theUserService, ["noms", "salad"]);
		let valid = await theAuthService.validateInviteCode("noms");
		expect(valid).toBeTruthy();
		valid = await theAuthService.validateInviteCode("lulz");
		expect(valid).toBeFalsy();
	});
});
