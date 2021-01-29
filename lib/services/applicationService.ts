import { checkPassword } from "./../password";
import localFileService from "./localFileService";
import userService, { User } from "./userService";

export default async function applicationService(appDirectory: string) {
	let userFileService = await localFileService(appDirectory, "json");
	let _userService = await userService(userFileService);
	let currentUser: User | undefined = undefined;

	async function loginUser(email: string, plainTextPassword: string) {
		try {
			let user = _userService.getUser(email);
			console.log(user);
			let valid = await checkPassword(plainTextPassword, user.hashedPassword);
			if (valid) {
				currentUser = user;
				return user;
			}
			console.log(valid, user);
		} catch (error) {
			console.log(error);
			throw error;
		}
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
