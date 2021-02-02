import applicationService from "./applicationService";

describe("applicationService", () => {
	it("Doesn't make errors when created", async () => {
		let service = await applicationService("test-files");
		expect(typeof service).toBe("object");
	});
	it("Uses the right type of git service", async () => {
		let service = await applicationService("test-files", [], false);
		expect(service.useGit).toBe(false);
	});
});
