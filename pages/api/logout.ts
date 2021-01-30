import { NextApiResponse, NextApiRequest } from "next";
import factory from "../../lib/factory";
//Says Hi to Roy
export default async (req: NextApiRequest, res: NextApiResponse) => {
	let app = await factory(undefined);
	switch (req.method) {
		default:
			await app.logoutCurrentUser();
			res.status(200).json({ message: "Logged out" });
			break;
	}
};
