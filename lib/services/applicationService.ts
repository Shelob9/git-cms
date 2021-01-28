import { hashPassword } from "./../password";
import localFileService from "./localFileService";
import userService, { User } from "./userService";

export default async function applicationService(appDirectory: string) {
	let userFileService = await localFileService(appDirectory, "json");
	let _userService = await userService(userFileService);
	let currentUser: User | undefined = undefined;

	async function loginUser(email: string, plainTextPassword: string) {
		let hashedPassword = await hashPassword(plainTextPassword);
		try {
			let user = _userService.getUser(email);
			if (user.hashedPassword === hashedPassword) {
				currentUser = user;
				return user;
			}
		} catch (error) {}
	}

	return {
		loginUser,
		currentUser,
		userService: _userService,
		logoutCurrentUser() {
			currentUser = undefined;
		},
	};
}
