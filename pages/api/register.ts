import { NextApiResponse, NextApiRequest } from "next";
import factory from "../../lib/factory";
/**
 * Register user via API
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
	let app = await factory(undefined);
	switch (req.method) {
		case "POST": {
			let { email, password, inviteCode } = req.body;
			try {
				let user = await app.registerUser(email, password, inviteCode);
				if (user) {
					let session = await app.authService.startUserSession(user);
					res.status(201).json({ session });
				} else {
					res
						.status(403)
						.json({ error: "User not created. Invite code invalid." });
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
};
