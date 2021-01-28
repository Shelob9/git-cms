import { AbstractFileService } from "./types";
import { encryptedMessage } from "./../encryptDecrypt";
export interface User {
	email: string;
}

export type UserMap = {
	[key: string]: User;
};
export type UserMapEncrypted = {
	[key: string]: encryptedMessage;
};
export default async function userService(fileService: AbstractFileService) {
	let users: UserMap = {
		"one@one.com": {
			email: "one@one.com",
		},
		"two@two.com": {
			email: "two@two.com",
		},
	};

	return {
		fetchUsers: async () => {
			let users = await fileService.fetchFile("users");
			return users;
			return new Promise(async (resolve, reject) => {
				resolve(users);
			});
		},
	};
}
