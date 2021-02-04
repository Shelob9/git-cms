import { gitRepoDetails } from "../git/GitApi";
import { checkPassword } from "../password";
import localFileService from "./localFileService";
import userService, {
	User,
	IUserService,
	IUserMeta,
	userMetaService
} from "./userService";
import authService, { IAuthService } from "./authService";
import gitFileService from "./gitFileService";
import GitApi from "../git/GitApi";

export interface IApplicationService {
	loginUser: (
		email: string,
		plainTextPassword: string
	) => Promise<User | false>;
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
	useGit: boolean | gitRepoDetails;
	setCurrentUser: (user: User | undefined) => Promise<void>;
}
export default async function applicationService(
	appDirectory: string,
	inviteCodes?: string[],
	useGit?: false | gitRepoDetails
): Promise<IApplicationService> {
	inviteCodes = inviteCodes ?? ["roy"];
	useGit = useGit ?? false;
	let userFileService =
		false === useGit
			? await localFileService(appDirectory, "json")
			: await gitFileService(GitApi(useGit, "main"), appDirectory, "json");
	let _userService = await userService(userFileService);
	let _authService = await authService(_userService, inviteCodes);
	let currentUser: User | undefined = undefined;
	let _userMetaService: IUserMeta | undefined = undefined;
	async function _setCurrentUser(user: User | undefined) {
		this.currentUser = user;
		if (this.currentUser) {
			this.currentUserMeta = await userMetaService(
				this.currentUser,
				this.userService
			);
		} else {
			this.currentUserMeta = undefined;
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
		setCurrentUser: _setCurrentUser
	};
}
