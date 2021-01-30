import { async } from "crypto-random-string";
import applicationService from "./applicationService";

describe("applicationService", () => {
	it("Doesn't make errors when created", async () => {
		let service = await applicationService("test-files");
		expect(typeof service).toBe("object");
	});
});
