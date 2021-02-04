import { NextApiResponse, NextApiRequest } from "next";
import applicationFactory from "../../src/lib/applicationFactory";
import { registerationController } from "../../src/controllers/userApi";

/**
 * Register user via API
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
	let app = await applicationFactory(undefined);
	await registerationController(app, req, res);
};
