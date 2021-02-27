import { decodeJwtToken } from "./jwt";
import { NextApiRequest } from "next";
import Cookies from "universal-cookie";
import { encryptedMessage } from "./encryptDecrypt";
export interface userJwtData {
	name: string;
	session: encryptedMessage;
}

const getSession = (
	req: NextApiRequest,
	cookieName: string
): userJwtData | false => {
	let token = "";
	if (req.headers.authorization) {
		token = req.headers.authorization;
	} else {
		const cookies = new Cookies(req ? req.headers.cookie : null);
		token = cookies.get(cookieName);
	}
	if (!token) {
		return false;
	}

	let session = decodeJwtToken(token);

	return session ?? false;
};

export default getSession;
