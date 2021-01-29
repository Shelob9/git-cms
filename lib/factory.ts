import applicationService from "./services/applicationService";

export default async function factory(dataDirectory: string | undefined) {
	let app = await applicationService(dataDirectory ?? "data");
	await app.userService.fetchUsers();
	return app;
}
