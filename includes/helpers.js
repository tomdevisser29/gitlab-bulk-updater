import chalk from "chalk";

const logError = (error) => {
  console.error(chalk.red(error));
};

const logSuccess = (message) => {
  console.log(chalk.green(message));
};

const logInfo = (message) => {
  console.log(chalk.blue(message));
};

export { logError, logSuccess, logInfo };
