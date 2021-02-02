import applicationService from "./services/applicationService";

export default async function factory(dataDirectory: string | undefined) {
	let useGit = process.env.GITCMS_USE_GIT ?? false;
	let app = await applicationService(
		dataDirectory ?? "data",
		[],
		useGit as boolean
	);
	await app.userService.fetchUsers();
	return app;
}
