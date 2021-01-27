import { Octokit } from "@octokit/rest";

/**
 * Get an octokit instance from token.
 *
 * @param authToken Optional token, will use the one from env if not passed.
 */
export function getOctokit(authToken?: string): Octokit {
	return new Octokit({
		auth: authToken ?? process.env.GITHUB_API_TOKEN,
	});
}
