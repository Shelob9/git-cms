import bcrypt from "bcrypt";

let SALT_ROUNDS = 10;
export const hashPassword = async (plainText: string): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		bcrypt.hash(plainText, SALT_ROUNDS, function(err, hash) {
			if (err) {
				reject(err);
			}
			resolve(hash);
		});
	});
};

export const checkPassword = async (
	plainText: string,
	hash: string
): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		bcrypt.compare(plainText, hash, function(err, result) {
			// result == true
			if (err) {
				reject(err);
			}
			resolve(result);
		});
	});
};
