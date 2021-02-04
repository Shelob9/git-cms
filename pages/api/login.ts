import { NextApiResponse, NextApiRequest } from "next";
import applicationFactory from "../../lib/applicationFactory";
import { loginController } from "../../src/controllers/userApi";
export default async (req: NextApiRequest, res: NextApiResponse) => {
	let app = await applicationFactory(undefined);
	await loginController(app, req, res);
};
