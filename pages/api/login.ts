import { NextApiResponse, NextApiRequest } from "next";
import applicationFactory from "../../lib/applicationFactory";

async function loginController(req: NextApiRequest, res: NextApiResponse) {
	let app = await applicationFactory(undefined);
	switch (req.method) {
		case "POST": {
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
			break;
		}
		default:
			res.status(405).json({ error: "Not implimented" });
			break;
	}
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
	await loginController(req, res);
};
