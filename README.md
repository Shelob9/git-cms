# GitCMS

Git-based CMS with optional React components and Next.js-integrations that dreams of being a distributed knowledge graph.

- [About Git-CMS](https://code.joshpress.net/notes/gitcms)
- The reference implimentation is [Digital Garden Builder](https://docs.digitalgardenbuilder.app/).

![Tests](https://github.com/Shelob9/next-starter/workflows/Tests/badge.svg)


## Installation

```sh
yarn add @digital-garden-builder/git-cms
```

## Using Application Container

GitCMS uses a service-based architecture. It is being developed to work with React and Next.JS, but neither are required. You could use the controllers with any HTTP framework or impliment the services in some other way.

### Create Application Container

The application container is a service that provides all of the services that make up GitCMS.

#### Application Factory

To simplify creating the application service, there is an application factory, that accepts two arguments:

```js
import {applicationFactory} from "@shelob9/gitcms"
const app = await applicationFactory(
  undefined,//storage path, defaults to '/data'
  {
    config: {
      useGit: {owner: "repo-org",repo: "repo-name"}
    },
    gitAuth
  }
)

```

- Storage path: `string|undefined`
  - Path for data storage dir in git repo
  - If undefined `/data` is used.
- Config: `GitCmsConfig|undefined`

#### Creating Application Service Manually

```js
import {applicationService} from "@shelob9/gitcms"

const app = await applicationService(
  '/my-data-path',//Storage path
  [], //Invite codes
  false// Use Git
  gitAuth//Gitub authentication
)
```

- Storage path: `string|undefined`
  - Path for data storage dir in git repo
  - If undefined `/data` is used.
- Invite codes: `string[]`
  - Array of valid invite codes for user registration.
- Use git : `bool|gitRepoDetials`
  - Use git (repo options) or node filesystem (false) to write files.
  - `{owner: "repo-org",repo: "repo-name"}`
- gitAuth: `string|any`
  - [Github Personal Access Token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/)
  - [Github app or oauth authentication](https://github.com/octokit/auth-app.js)


## Users

GitCMS supports user registration and login. Users are authenticatied by email and password. User data is encrypted.

User system should not be considered secure yet beacuse, there is no email verification or two factor. Emails are public right now, if git repo is public.

 Also, passwords are annoying, I will impliment [magic.link](https://magic.link) soon.

### User Service

The user service, which is availble from the main app instance, can create and modify users:

```js
//Create a user
let user = await app.userService.createUser("test@email.com", "password");
//Set user as current user
await app.setCurrentUser(user);
```

It can also modify their encryped user data. This is an ecrypted key, value store. Each value, can be a string or number.

```js
await app.currentUserMeta.saveMeta("doggo", "puppers");
let value = await service.currentUserMeta.getMeta("doggo");
```

### User API

To create a user API, you will need to create an instance of the app, and provide it, along with HTTP request and response objects to one of the controllers. The API is developed for NextJS, but should work with Express. I have not test that yet.

#### Login Controller

```js
import { NextApiResponse, NextApiRequest } from "next";
import { applicationFactory, loginController } from "@shelob9/gitcms";
export default async (req: NextApiRequest, res: NextApiResponse) => {
	let app = await applicationFactory(undefined);
  await loginController(app, req, res);
};
```

#### Registration Controller

```js
import { NextApiResponse, NextApiRequest } from "next";
import { applicationFactory, registerationController } from "@shelob9/gitcms";
export default async (req: NextApiRequest, res: NextApiResponse) => {
	let app = await applicationFactory(undefined);
  await registerationController(app, req, res);
};
```

#### Logout Controller

```js
import { NextApiResponse, NextApiRequest } from "next";
import { applicationFactory, logoutController } from "@shelob9/gitcms";
export default async (req: NextApiRequest, res: NextApiResponse) => {
	let app = await applicationFactory(undefined);
  await logoutController(app, req, res);
};
```

## Working With Files

There are two files services. The first, `gitFileService`, uses Git and the other, `localFileService` uses the file system -- this is for development. They both impliment the `AbstractFileService` interface.

### Git API Client

The `gitFileService` service depenes on `GitApi`.

```js
import {GitApi} from "@shelob9/gitcms"
let api = GitApi(
  //Repo details
  {
    owner: "repo-org",
    repo: "repo-name"
  },
  //Branch
  "main",
  //Authentication 
  auth
);

```

- Repo details
  - Owner name and repo name for repo used for storage.
- Branch
  - Git branch to in that repo.
- Authentication
  - An authentication token or [object](https://github.com/octokit/auth.js/#official-strategies) that has permission to read/ write the repo.

### File Services

Both file services have the same API, but only the git service requires GitAPI. File services read and write files from one directory. You must specify a file type -- markdown or JSON. Only those files will be used. Markdown files will be parsed to HTML using [mdx-js](https://mdxjs.com/).

```js
let git = await gitFileService(
  api,//GitApi instance
  'products',//directory
  'json'//extension
);

let local = await localFileService(
  'posts',//directory
  'md'//extension
);
```

Working with files is the same, does not matter which service:

```js
//Get all files in directory
let fileIndex = await fileService.fetchIndex();
let { content } = await service.fetchFile("name-of-file-no-extension");
{ content } = await service.saveFile("write-test", "Spatula");
```

### Markdown Parsing

Not implimented yet.


### File API Routes

Not impimented yet.

## Development

- Install
  - `git clone ...`
  - `yarn`
- Start
  - `yarn dev`
- Test
  - `yarn test`
  - `yarn test --watch`
  - `yarn test --ci`
- Build lib for distribution
  - `yarn build:lib`
- Lint
  - `yarn lint`

### Publish

```bash
yarn release
```

### Environment Variables

- `GITCMS_USE_GIT`
  - Use git: `GITCMS_USE_GIT=true`
  - Use local file system: `GITCMS_USE_GIT=true`

## Pull Requests Welcome

This is an experiment by [Josh Pollock](https://joshpress.net), [please feel free to play along](https://github.com/Shelob9/git-cms/pulls).

