import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import getSession from "../../lib/getSession";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = getSession(req, "space-macroons");
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Cache-Control", "s-maxage=360");
	res.status(200).json({ hi: "Roy", session });
};
