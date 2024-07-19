import {
  getProjects,
  getProjectFiles,
  updateProjectFile,
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

const updateFiles = async () => {
  const projects = await getProjects({
    owned: true,
  });

  projects.forEach(async (project) => {
    console.log(project.name);
    const files = await getProjectFiles(project);

    files.forEach(async (file) => {
      const search = "";
      const replace = "";
      const commitMessage = "";

      await updateProjectFile(project, file, search, replace, commitMessage);
    });
  });
};

// updateFiles();
checkFilesForString();
