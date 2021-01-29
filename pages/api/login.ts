import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import factory from "../../lib/factory";
export default async (req: NextApiRequest, res: NextApiResponse) => {
	let app = await factory(undefined);
	let { email, password } = req.body;
	try {
		let user = await app.loginUser(email, password);
		if (user) {
			let session = await app.authService.startUserSession(user);
			res.status(200).json({ session });
		} else {
			res.status(403).json({ error: "User not found" });
		}
	} catch (error) {
		res.status(403).json({ error });
	}
};
