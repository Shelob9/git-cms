import { async } from "crypto-random-string";
import { checkPassword } from "./../password";
import localFileService from "./localFileService";
import userService, { User, IUserService } from "./userService";
import authService, { IAuthService } from "./authService";

export interface IApplicationService {
	loginUser: (email: string, plainTextPassword: string) => Promise<User>;
	currentUser: User | undefined;
	userService: IUserService;
	authService: IAuthService;
	logoutCurrentUser: () => Promise<undefined>;
}
export default async function applicationService(appDirectory: string) {
	let userFileService = await localFileService(appDirectory, "json");
	let _userService = await userService(userFileService);
	let _authService = await authService(_userService);
	let currentUser: User | undefined = undefined;

	async function loginUser(email: string, plainTextPassword: string) {
		try {
			let user = _userService.getUser(email);
			let valid = await checkPassword(plainTextPassword, user.hashedPassword);
			if (valid) {
				currentUser = user;
				return user;
			}
			return false;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	return {
		loginUser,
		currentUser,
		userService: _userService,
		authService: _authService,
		logoutCurrentUser: async () => {
			currentUser = undefined;
			return undefined;
		},
	};
}
