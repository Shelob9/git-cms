import { createJwtToken } from "./../jwt";
import { hashPassword } from "./../password";
import { AbstractFileService } from "./types";
import { encrypt, decrypt, encryptedMessage } from "./../encryptDecrypt";
import cryptoRandomString from "crypto-random-string";
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

export interface IUserService {
	getUser(email: string): User;
	fetchUsers(): Promise<UserMap>;
	updateUser(data: UserUpdateInput): Promise<UserMap>;
	createUser(email: string, plainTextPassword: string): Promise<User>;
}
export default async function userService(
	fileService: AbstractFileService
): Promise<IUserService> {
	let users: UserMap = {};

	/**
	 * Sets the user map (users variable) from encrypted JSON.
	 */
	async function setMap(jsonString: string) {
		let _users = JSON.parse(jsonString);
		Object.keys(_users).forEach(async (k) => {
			let data = await decrypt(_users[k].data);

			users[k] = {
				hashedPassword: _users[k].hashedPassword,
				//@ts-ignore
				data: JSON.parse(data),
			};
		});
	}

	/**
	 * Save all users
	 *
	 * Returns unencrypted user map
	 */
	async function saveUsers(): Promise<UserMap> {
		return new Promise(async (resolve) => {
			let _users = {};
			Object.keys(users).forEach((email) => {
				let data = encrypt(JSON.stringify(users[email].data));
				_users[email] = {
					hashedPassword: users[email].hashedPassword,
					data,
				};
			});
			await fileService.saveFile("users", JSON.stringify(_users));
			resolve(users);
		});
	}

	/**
	 * Load all users
	 */
	async function fetchUsers(): Promise<UserMap> {
		return new Promise(async (resolve, reject) => {
			let { content } = await fileService.fetchFile("users");
			setMap(content);
			resolve(users);
		});
	}

	/**
	 * Get a user by email
	 *
	 * Must call fetchUsers() first
	 * @param email
	 */
	function getUser(email: string) {
		return users[email];
	}
	return {
		getUser,
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

			let user: User = {
				hashedPassword,
				data: { encryptionKey, email },
			};
			users[email] = user;

			await saveUsers();
			return user;
		},
	};
}
