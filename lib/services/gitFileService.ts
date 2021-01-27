import { IGitApi } from "./../git/GitApi";
export default async function gitFileService(
	client: IGitApi,
	directory: string,
	extension: "md" | "json"
) {
	this.index = [];
	return {
		getIndex: () => {
			return this.index;
		},
		fetchNoteIndex: async () => {
			return client.getFiles(directory, extension).then((r) => {
				this.index = r.map((file) => {
					let { path, name } = file;
					let slug = path.replace(".md", "").replace("notes/", "");
					return {
						slug,
						path,
						name,
					};
				});
				return this.index;
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
