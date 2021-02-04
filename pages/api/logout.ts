import { NextApiResponse, NextApiRequest } from "next";
import applicationFactory from "../../lib/applicationFactory";

async function logoutController(req: NextApiRequest, res: NextApiResponse) {
	let app = await applicationFactory(undefined);
	switch (req.method) {
		default:
			await app.logoutCurrentUser();
			res.status(200).json({ message: "Logged out" });
			break;
	}
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await logoutController(req, res);
};
