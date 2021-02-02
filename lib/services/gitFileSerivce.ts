import gitFileService from "./gitFileService";
import GitApi from "../git/GitApi";
describe("Git file service", () => {
	it("is an object", () => {
		let service = gitFileService(
			GitApi({ repo: "a", owner: "q" }, "main"),
			"dir",
			"md"
		);
		//yolo test
		expect(typeof service).toBe("object");
	});
});
