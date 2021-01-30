import { createJwtToken, decodeJwtToken } from "./../jwt";
import { IUserService, User } from "./userService";
import { v4 as uuid } from "uuid";
import crypto from "crypto";
/**
 * Create sha256 hash of string
 */
export const hashString = (str: string) =>
	crypto.createHash("sha256").update(str).digest("hex");

export interface IAuthService {
	validateSessionToken: (sessionId: string, jwt: string) => Promise<boolean>;
	startUserSession: (user: User) => Promise<{ sessionId: string; jwt: string }>;
	validateInviteCode: (code: string) => Promise<boolean>;
}
export default async function authService(
	userService: IUserService,
	inviteCodes: string[]
): Promise<IAuthService> {
	async function validateInviteCode(code: string): Promise<boolean> {
		return new Promise(async (resolve) => {
			return resolve(inviteCodes.includes(code));
		});
	}

	async function startUserSession(
		user: User
	): Promise<{ sessionId: string; jwt: string }> {
		let sessionId = uuid();
		let jwt = createJwtToken({
			email: user.data.email,
			sessionId: hashString(`${user.data.encryptionKey}-${sessionId}`),
		});
		return { sessionId, jwt };
	}

	async function validateSessionToken(sessionId: string, jwt: string) {
		await userService.fetchUsers();
		try {
			let data = decodeJwtToken(jwt);
			let user = userService.getUser(data.email);
			if (!user) {
				throw new Error("User not found. Email: " + data.email);
			}
			return (
				data.sessionId === hashString(`${user.data.encryptionKey}-${sessionId}`)
			);
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	return {
		validateSessionToken,
		startUserSession,
		validateInviteCode,
	};
}
