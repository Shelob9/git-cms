import { gitRepoDetails } from "./git/GitApi";
import applicationService from "./services/applicationService";

export type gitCmsConfig = {
	useGit: false | gitRepoDetails;
};

export type appFactoryOptions = {
	config?: gitCmsConfig;
	gitAuth?: string | any;
};
export default async function applicationFactory(
	dataDirectory: string | undefined,
	{ gitAuth, config }: appFactoryOptions | undefined
) {
	config = config ?? {
		useGit: false
	};

	//let useGit = process.env.GITCMS_USE_GIT ?? false;
	let app = await applicationService(
		dataDirectory ?? "data",
		["roy"],
		config.useGit,
		gitAuth
	);
	await app.userService.fetchUsers();
	return app;
}
