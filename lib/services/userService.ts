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
	let users: UserMap = {};

	function setMap(jsonString) {
		let _users = JSON.parse(jsonString);
		Object.keys(_users).forEach((k) => {
			users[k] = {
				email: _users[k].hasOwnProperty("email") ? _users[k].email : k,
			};
		});
	}

	return {
		fetchUsers: async () => {
			return new Promise(async (resolve, reject) => {
				let { content } = await fileService.fetchFile("users");
				setMap(content);
				resolve(users);
			});
		},
		updateUser: async (data: User) => {
			users[data.email] = data;
			return new Promise(async (resolve) => {
				await fileService.saveFile("users", JSON.stringify(users));
				resolve(users);
			});
		},
	};
}
