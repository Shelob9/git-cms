import { NextApiResponse, NextApiRequest } from "next";
import factory from "../../lib/factory";

async function logoutController(req: NextApiRequest, res: NextApiResponse) {
	let app = await factory(undefined);
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
