import { IApplicationService } from "./../../lib/services/applicationService";
import { NextApiRequest, NextApiResponse } from "next";
export async function loginController(
	app: IApplicationService,
	req: NextApiRequest,
	res: NextApiResponse
) {
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

export async function logoutController(
	app: IApplicationService,
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		default:
			await app.logoutCurrentUser();
			res.status(200).json({ message: "Logged out" });
			break;
	}
}

export async function registerationController(
	app: IApplicationService,
	req: NextApiRequest,
	res: NextApiResponse
) {
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
}
