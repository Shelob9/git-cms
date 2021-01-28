import { hashPassword } from "./../password";
import { AbstractFileService } from "./types";
import { encrypt, encryptedMessage } from "./../encryptDecrypt";
import cryptoRandomString from "crypto-random-string";
import { resolve } from "path";
export interface UserData {
	encryptionKey: string;
	email: string;
}
export interface User {
	hashedPassword: string;
	data: UserData;
}

export interface UserEncrypted {
	hashedPassword: string;
	data: encryptedMessage;
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
				hashedPassword: _users[k].hashedPassword,
				data: {
					email: _users[k].data.email ?? k,
					encryptionKey: _users[k].data.encryptionKey,
				},
			};
		});
	}

	async function saveUsers(): Promise<UserMap> {
		return new Promise(async (resolve) => {
			let _users = {};
			Object.keys(users).forEach((email) => {
				let data = encrypt(JSON.stringify(users[email].data));
				_users[email] = {
					hashPassword: users[email].hashedPassword,
					data,
				};
			});
			await fileService.saveFile("users", JSON.stringify(_users));
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
		getUser(email: string) {
			return users[email];
		},
		fetchUsers,
		updateUser: async (data: UserUpdateInput): Promise<UserMap> => {
			users[data.email] = {
				...data,
				hashedPassword: users[data.email].hashedPassword,
				data: {
					...users[data.email].data,
				},
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
			let encryptionKey = cryptoRandomString({
				length: 42,
				type: "alphanumeric",
			});

			let user = {
				hashedPassword,
				data: { encryptionKey, email },
			};
			users[email] = user;
			await saveUsers();
			return user;
		},
	};
}
