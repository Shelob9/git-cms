import { gitRepoDetails } from "./git/GitApi";
import applicationService from "./services/applicationService";
import config from "../data/config";

export type gitCmsConfig = {
	useGit: false | gitRepoDetails;
};
export default async function applicationFactory(
	dataDirectory: string | undefined
) {
	//let useGit = process.env.GITCMS_USE_GIT ?? false;
	let app = await applicationService(
		dataDirectory ?? "data",
		[],
		config.useGit
	);
	await app.userService.fetchUsers();
	return app;
}
