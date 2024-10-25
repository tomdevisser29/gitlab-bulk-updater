# GitLab Bulk Updater

## Instructions

### Create a personal access token on GitLab

1. Visit GitLab
2. On the left sidebar, select your avatar
3. Select Edit profile
4. On the left sidebar, select Access Tokens
5. Select Add new token
6. Enter a name and expiry date, if you don't enter an expiry date, it's automatically set to 365 days
7. Set the scope to api
8. Select Create personal access token
9. Save your token in the .env file as GITLAB_PERSONAL_ACCESS_TOKEN

### Usage

Every API call is made asynchronously, so you need to wrap all your code in an async function in `index.js` and call the function at the end of the file. See the examples.

Some functions have a link to the related documentation from GitLab. For example, when retrieving projects from the GitLab API, there are a lot of filters you can choose from. These are all listed on the link provided.

```js
// @see https://docs.gitlab.com/ee/api/projects.html
const getProjects = async (filter = {}) => {};
```

1. Run `npm install` in your terminal
2. Add your personal access token to the `.env` file (see instructions above)
3. Modify the main script in `index.js` (see examples below)
4. Run `node index.js`

## Examples

You can paste these examples right in your `index.js` file.

### Updating files

```js
import {
  getProjects,
  getProjectFiles,
  updateProjectFile,
} from "./includes/gitlab.js";

const updateFiles = async () => {
  const projects = await getProjects({
    owned: true,
  });

  projects.forEach(async (project) => {
    const files = await getProjectFiles(project);

    files.forEach(async (file) => {
      const search = "";
      const replace = "";
      const commitMessage = "";

      await updateProjectFile(project, file, search, replace, commitMessage);
    });
  });
};

updateFiles();
```

### Searching for strings

```js
import {
  getProjects,
  getProjectFiles,
  checkIfFileContainsString,
} from "./includes/gitlab.js";
import { logInfo } from "./includes/helpers.js";

const checkFilesForString = async () => {
  const projects = await getProjects({
    owned: true,
  });

  for (const project of projects) {
    logInfo(`Fetching files in ${project.name}`);
    const files = await getProjectFiles(project, "php");

    for (const file of files) {
      const string = "";
      const containsString = await checkIfFileContainsString(
        string,
        file,
        project
      );

      if (containsString) {
        logInfo(`- ${file.name} in ${project.name} contains "${string}"`);
      }
    }
  }
};

checkFilesForString();
```
