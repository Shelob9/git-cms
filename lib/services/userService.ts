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
export default async function userSerivce() {
	let users: UserMap = {
		one: {
			email: "one@one.com",
		},
		two: {
			email: "two@two.com",
		},
	};

	return {
		fetchUsers: async () => {
			return new Promise(async (resolve, reject) => {
				resolve(users);
			});
		},
	};
}
