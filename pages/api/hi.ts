import { NextApiRequest, NextApiResponse } from "next";

//Says Hi to Roy
export default async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case "GET": {
			res.setHeader("Content-Type", "application/json");
			res.setHeader("Cache-Control", "s-maxage=360");
			res.status(200).json({ hi: "Roy" });
			break;
		}
		default:
			res.status(405).json({ error: "Not implimented" });
			break;
	}
};
