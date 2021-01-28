import { AbstractFileService, fileIndex } from "./types";
import fs from "fs";
import glob from "glob";

export default async function localFileService(
	directory: string,
	extension: "md" | "json"
): Promise<AbstractFileService> {
	let index: fileIndex = [];
	let globPattern = `${directory}/*.${extension}`;
	async function _fetchIndex() {
		return new Promise(async (resolve, reject) => {
			// options is optional
			glob(globPattern, {}, function (err, files) {
				if (err) {
					reject(err);
				}
				files.forEach((path) => {
					index.push({
						path,
						name: path.replace(`${directory}/`, ""),
					});
				});
				resolve(index);
			});
		});
	}

	return {
		getIndex: () => {
			return index;
		},
		fetchIndex: async () => {
			await _fetchIndex();
			return index;
		},
		fetchFile: async (name: string) => {
			let filePath = `${process.cwd()}/${directory}/${name}.${extension}`;
			return new Promise(async (resolve, reject) => {
				const content = fs.readFileSync(filePath, {
					encoding: "utf8",
					flag: "r",
				});

				resolve({ content });
			});
		},
		saveFile: async (name: string, content: string) => {
			let filePath = `${process.cwd()}/${directory}/${name}.${extension}`;
			return new Promise(async (resolve, reject) => {
				fs.writeFileSync(filePath, content, {
					encoding: "utf8",
				});

				resolve({ content });
			});
		},
	};
}
