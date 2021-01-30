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
	registerUser: (
		email: string,
		plainTextPassword: string,
		inviteCode: string
	) => Promise<User | boolean>;
}
export default async function applicationService(appDirectory: string) {
	let inviteCodes = ["roy"];
	let userFileService = await localFileService(appDirectory, "json");
	let _userService = await userService(userFileService);
	let _authService = await authService(_userService, inviteCodes);
	let currentUser: User | undefined = undefined;

	function logError(error: Error | any) {
		console.log(error);
	}
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
			logError(error);
			throw error;
		}
	}

	async function registerUser(
		email: string,
		plainTextPassword: string,
		inviteCode: string
	): Promise<User | false> {
		let inviteCodeValid = await _authService.validateInviteCode(inviteCode);
		console.log(inviteCodeValid, inviteCode);
		if (inviteCodeValid) {
			try {
				let user = await _userService.createUser(email, plainTextPassword);
				console.log(user);
				currentUser = user;
				return user;
			} catch (error) {
				logError(error);
				return false;
			}
		}
		return false;
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
		registerUser,
	};
}
