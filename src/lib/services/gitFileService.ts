import { IGitApi } from "./../git/GitApi";
import { AbstractFileService, fileIndex } from "./types";

export interface IGitFileService extends AbstractFileService {
	getClient: () => IGitApi;
}
export default async function gitFileService(
	client: IGitApi,
	directory: string,
	extension: "md" | "json"
): Promise<IGitFileService> {
	let index: fileIndex = [];
	return {
		getClient() {
			return client;
		},
		getIndex: () => {
			return index;
		},
		fetchIndex: async () => {
			return this.getClient()
				.getFiles(directory, extension)
				.then(r => {
					index = r.map(file => {
						let { path, name } = file;
						return {
							path,
							name
						};
					});
					return index;
				});
		},
		fetchFile: async (name: string) => {
			return this.client
				.getFile(`${directory}/${name}.${extension}`)
				.then(({ content }) => {
					return { content };
				});
		},
		saveFile: async (
			name: string,
			contents: string
		): Promise<{ content: string }> => {
			return await this.client.saveFile(
				contents,
				`${directory}/${name}.${extension}`,
				`Update ${name}`
			);
		}
	};
}
