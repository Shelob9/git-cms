import { NextApiResponse, NextApiRequest } from "next";
import applicationFactory from "../../src/lib/applicationFactory";
import { logoutController } from "../../src/controllers/userApi";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	let app = await applicationFactory(undefined, undefined);
	await logoutController(app, req, res);
};
