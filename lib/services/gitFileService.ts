import { AbstractFileService, fileIndex } from "./types";
import { IGitApi } from "./../git/GitApi";

export default async function gitFileService(
	client: IGitApi,
	directory: string,
	extension: "md" | "json"
): Promise<AbstractFileService> {
	let index: fileIndex = [];
	return {
		getIndex: () => {
			return index;
		},
		fetchIndex: async () => {
			return client.getFiles(directory, extension).then((r) => {
				index = r.map((file) => {
					let { path, name } = file;
					return {
						path,
						name,
					};
				});
				return index;
			});
		},
		fetchFile: async (name: string, extension: "md" | "json") => {
			return this.client
				.getFile(`${directory}/${name}.${extension}`)
				.then(({ content }) => {
					return { content };
				});
		},
	};
}
