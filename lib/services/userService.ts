import { hashPassword } from "./../password";
import { AbstractFileService } from "./types";
import { encryptedMessage } from "./../encryptDecrypt";
export interface User {
	email: string;
	hashedPassword: string;
}

export type UserMap = {
	[key: string]: User;
};

export type UserUpdateInput = {
	email: string;
};
export type UserMapEncrypted = {
	[key: string]: encryptedMessage;
};
export default async function userService(fileService: AbstractFileService) {
	let users: UserMap = {};

	function setMap(jsonString: string) {
		let _users = JSON.parse(jsonString);
		Object.keys(_users).forEach((k) => {
			users[k] = {
				email: _users[k].email ?? k,
				hashedPassword: _users[k].hashedPassword,
			};
		});
	}

	async function saveUsers(): Promise<UserMap> {
		return new Promise(async (resolve) => {
			await fileService.saveFile("users", JSON.stringify(users));
			resolve(users);
		});
	}

	async function fetchUsers() {
		return new Promise(async (resolve, reject) => {
			let { content } = await fileService.fetchFile("users");
			setMap(content);
			resolve(users);
		});
	}
	return {
		getUsers() {
			return users;
		},
		fetchUsers,
		updateUser: async (data: UserUpdateInput): Promise<UserMap> => {
			users[data.email] = {
				...data,
				hashedPassword: users[data.email].hashedPassword,
			};
			return await saveUsers();
		},

		createUser: async (
			email: string,
			plainTextPassword: string
		): Promise<User> => {
			if (users.length) {
				await fetchUsers();
			}
			let hashedPassword = await hashPassword(plainTextPassword);
			let user = {
				email,
				hashedPassword,
			};
			users[email] = user;
			return new Promise(async (resolve) => {
				await fileService.saveFile("users", JSON.stringify(users));
				resolve(user);
			});
		},
	};
}
