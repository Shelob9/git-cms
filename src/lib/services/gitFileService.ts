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
	function getClient() {
		return client;
	}
	let self = {
		getClient,
		getIndex: () => {
			return index;
		},
		fetchIndex: async () => {
			return self
				.getClient()
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
			return self
				.getClient()
				.getFile(`${directory}/${name}.${extension}`)
				.then(({ content }) => {
					return { content };
				});
		},
		saveFile: async (
			name: string,
			contents: string
		): Promise<{ content: string }> => {
			await self
				.getClient()
				.saveFile(
					contents,
					`${directory}/${name}.${extension}`,
					`Update ${name}`
				);
			return { content: contents };
		}
	};
	return self;
}
