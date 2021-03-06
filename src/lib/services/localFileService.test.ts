import localFileService from "./localFileService";
import fs from "fs";
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

	it("Gets fetched index", async () => {
		let service = await localFileService("test-files", "json");
		let fileIndex = await service.fetchIndex();
		expect(fileIndex.length).toEqual(service.getIndex().length);
	});

	it("fetches files", async () => {
		let service = await localFileService("test-files", "md");
		let { content } = await service.fetchFile("one");
		expect(content).toBe("# One");
	});

	it("Saves files", async () => {
		fs.copyFileSync(
			`${process.cwd()}/test-files/write/_write-test.md`,
			`${process.cwd()}/test-files/write/write-test.md`
		);
		let service = await localFileService("test-files/write", "md");
		let { content } = await service.saveFile("write-test", "Spatula");
		expect(content).toBe("Spatula");
	});
});
