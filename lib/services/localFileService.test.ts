import localFileService from "./localFileService";

describe("localfielService", () => {
	it("finds json files", async () => {
		let service = await localFileService("test-files", "json");
		let fileIndex = await service.fetchIndex();
		expect(fileIndex.length).toBe(2);
		expect(fileIndex[0].path).toBe("test-files/one.json");
		expect(fileIndex[0].name).toBe("one.json");
	});

	it("finds markdwon files", async () => {
		let service = await localFileService("test-files", "md");
		let fileIndex = await service.fetchIndex();
		expect(fileIndex.length).toBe(3);
		expect(fileIndex[2].path).toBe("test-files/two.md");
		expect(fileIndex[2].name).toBe("two.md");
	});
});
