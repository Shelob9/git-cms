import { async } from "crypto-random-string";
import { checkPassword } from "./../password";
import localFileService from "./localFileService";
import userService, {
	User,
	IUserService,
	IUserMeta,
	userMetaService,
} from "./userService";
import authService, { IAuthService } from "./authService";

export interface IApplicationService {
	loginUser: (email: string, plainTextPassword: string) => Promise<User>;
	currentUser: User | undefined;
	currentUserMeta: IUserMeta | undefined;
	userService: IUserService;
	authService: IAuthService;
	logoutCurrentUser: () => Promise<undefined>;
	registerUser: (
		email: string,
		plainTextPassword: string,
		inviteCode: string
	) => Promise<User | boolean>;
	useGit: boolean;
}
export default async function applicationService(
	appDirectory: string,
	inviteCodes?: string[],
	useGit?: boolean
) {
	inviteCodes = inviteCodes ?? ["roy"];
	useGit = useGit ?? false;
	let userFileService = await localFileService(appDirectory, "json");
	let _userService = await userService(userFileService);
	let _authService = await authService(_userService, inviteCodes);
	let currentUser: User | undefined = undefined;
	let _userMetaService: IUserMeta | undefined = undefined;
	async function _setCurrentUser(user: User | undefined) {
		currentUser = user;
		if (currentUser) {
			_userMetaService = await userMetaService(currentUser, _userService);
		} else {
			_userMetaService = undefined;
		}
	}
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
		if (inviteCodeValid) {
			try {
				let user = await _userService.createUser(email, plainTextPassword);
				_setCurrentUser(user);
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
		currentUserMeta: _userMetaService,
		userService: _userService,
		authService: _authService,
		logoutCurrentUser: async () => {
			_setCurrentUser(undefined);
			return undefined;
		},
		registerUser,
		useGit,
	};
}
