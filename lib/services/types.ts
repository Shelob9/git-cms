/**
 * A list of matching files in the directory.
 */
export type fileIndex = {
	path: string;
	name: string;
}[];

/**
 * A file service
 */
export interface AbstractFileService {
	/**
	 * Get the file index
	 *
	 * Must have already been fetched.
	 */
	getIndex: () => fileIndex;
	/**
	 * Fetch the index.
	 *
	 * Makes index available,, without triggering fetch, via getIndex().
	 */
	fetchIndex: () => Promise<fileIndex>;
	/**
	 * Fetch one file
	 */
	fetchFile: (name: string) => Promise<{ content: string }>;
}
