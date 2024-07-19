import "dotenv/config";
import axios from "axios";
import { logSuccess, logError, logInfo } from "./helpers.js";

const baseUrl = "https://gitlab.com/api/v4/";
const token = process.env.GITLAB_PERSONAL_ACCESS_TOKEN;

// @see https://docs.gitlab.com/ee/api/projects.html
const getProjects = async (filter = {}) => {
  let allProjects = [];
  let currentPage = 1;
  let totalPages = 0;

  logInfo(`Started fetching projects from GitLab`);

  do {
    try {
      const response = await axios.get(`${baseUrl}projects`, {
        headers: {
          "PRIVATE-TOKEN": token,
        },
        params: { ...filter, page: currentPage, per_page: 100 }, // Adjust per_page as needed
      });

      allProjects = allProjects.concat(response.data);
      totalPages = parseInt(response.headers["x-total-pages"], 10);
      currentPage++;
    } catch (error) {
      logError(error.message);
      break; // Exit loop on error
    }
  } while (currentPage <= totalPages);

  logSuccess(`Fetched ${allProjects.length} projects from GitLab`);
  return allProjects;
};

const fetchFilesAndDirs = async (project, path = "") => {
  try {
    const response = await axios.get(
      `${baseUrl}projects/${project}/repository/tree?path=${encodeURIComponent(
        path
      )}`,
      {
        headers: {
          "PRIVATE-TOKEN": token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch files and directories:", error.message);
    return [];
  }
};

// @see https://docs.gitlab.com/ee/api/repository_files.html
async function getProjectFiles(project, extension = "", path = "") {
  let allFiles = [];
  const filesAndDirs = await fetchFilesAndDirs(project.id, path);

  for (const item of filesAndDirs) {
    if (item.type === "tree") {
      if (
        item.name === "node_modules" ||
        item.name === "vendor" ||
        item.name === "build" ||
        item.name === ".gitlab" ||
        item.name === ".vscode"
      ) {
        continue;
      }

      const subDirFiles = await getProjectFiles(project, extension, item.path);
      allFiles = allFiles.concat(subDirFiles);
    } else if (item.type === "blob") {
      // Only check files with a specific extension
      if (extension && !item.name.endsWith(extension)) {
        continue;
      }
      allFiles.push(item);
    }
  }

  return allFiles;
}

const updateProjectFile = async (
  project,
  file,
  search,
  replace,
  commitMessage,
  branch = "main"
) => {
  try {
    const response = await axios.get(
      `${baseUrl}projects/${project.id}/repository/files/${file.path}/raw`,
      {
        headers: {
          "PRIVATE-TOKEN": token,
        },
      }
    );

    if (!response.data.includes(search)) {
      return;
    }

    const content = response.data.replace(search, replace);

    axios.put(
      `${baseUrl}projects/${project.id}/repository/files/${file.path}`,
      {
        branch,
        content,
        commit_message: commitMessage,
      },
      {
        headers: {
          "PRIVATE-TOKEN": token,
        },
      }
    );
    logSuccess(`- Updated ${file.name} in ${project.name}`);
  } catch (error) {
    logError(`- Error updating ${file.name} in ${project.name}`);
    logError(error.message);
  }
};

const checkIfFileContainsString = async (string, file, project) => {
  try {
    // URL encode the file path to ensure it's correctly interpreted by the API
    const encodedFilePath = encodeURIComponent(file.path);
    const response = await axios.get(
      `${baseUrl}projects/${project.id}/repository/files/${encodedFilePath}/raw`,
      {
        headers: {
          "PRIVATE-TOKEN": token,
        },
      }
    );

    logSuccess(`- Checked ${file.name} in ${project.name}`);

    return String(response.data).includes(string);
  } catch (error) {
    logError(`- Error checking ${file.name} in ${project.name}`);
    console.dir(file);
    logError(error);
    return false;
  }
};

export {
  getProjects,
  getProjectFiles,
  updateProjectFile,
  checkIfFileContainsString,
};
