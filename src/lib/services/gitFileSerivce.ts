import gitFileService from "./gitFileService";
import GitApi from "../git/GitApi";
describe("Git file service", () => {
	it("is an object", async () => {
		let service = await gitFileService(
			GitApi({ repo: "a", owner: "q" }, "main"),
			"dir",
			"md"
		);
		//yolo test
		expect(typeof service).toBe("object");
	});
	it("Holds instance of client", async () => {
		let api = GitApi({ repo: "a", owner: "q" }, "main");
		let service = await gitFileService(api, "dir", "md");
		expect(service.getClient()).toEqual(api);
	});
});
