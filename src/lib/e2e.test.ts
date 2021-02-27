/**
 * Tests that use acutal Github api
 */

import GitApi from "./git/GitApi";
import gitFileService from "./services/gitFileService";
describe("GitAPI", () => {
	test("will read and write a markdown file", async () => {
		//@todo set in CI
		if (process.env.GITHUB_TOKEN) {
			expect(1).toEqual(1);
		} else {
			let git = GitApi(
				{
					owner: "Shelob9",
					repo: "garden-cms-test-data"
				},
				"main",
				process.env.GITHUB_TOKEN
			);
			let fileService = await gitFileService(git, "gitcms", "md");
			await fileService.fetchIndex();
			let i = fileService.getIndex();
			let file = await fileService.fetchFile("one");
			let update = `${Math.random()
				.toString(36)
				.substring(7)}HI ROY!!!${Math.random()
				.toString(36)
				.substring(7)}`;
			await fileService.saveFile("one", update);
			file = await fileService.fetchFile("one");
			expect(file.content).toEqual(update);
		}
	});

	test(" will read and write a json file", async () => {
		if (process.env.GITHUB_TOKEN) {
			expect(1).toEqual(1);
		} else {
			let git = GitApi(
				{
					owner: "Shelob9",
					repo: "garden-cms-test-data"
				},
				"main",
				process.env.GITHUB_TOKEN
			);
			let fileService = await gitFileService(git, "gitcms/api", "json");
			await fileService.fetchIndex();
			let file = await fileService.fetchFile("one");
			let update = `${Math.random()
				.toString(36)
				.substring(7)}HI ROY!!!${Math.random()
				.toString(36)
				.substring(7)}`;
			let data = JSON.parse(file.content);
			data.title = update;
			let updateFile = JSON.stringify(data);
			await fileService.saveFile("one", updateFile);
			file = await fileService.fetchFile("one");
			data = JSON.parse(file.content);
			expect(data.title).toEqual(update);
			expect(data.hasOwnProperty("userId")).toBeTruthy();
		}
	});
});
