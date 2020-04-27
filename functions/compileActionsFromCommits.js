// Turning commits affecting files into actions to perform on the inventory

/* starting from the latest commit
 * for each entity file,
 *   if the latest action was a remove, run remove
 *   if the latest action was an add or modify, run update
 * Example output (of a file move):
 * {
 *    "entityFile.ext": "remove",
 *    "entityFolder/entityFile.ext": "update"
 * }
 **/

module.exports = function compileActionsFromCommits(fileExtension, commits) {
  return commits.reverse().reduce((actions, commit) => {
    commit.removed
      .filter((filePath) => filePath.includes(fileExtension))
      .forEach((filePath) => {
        if (!actions[filePath]) {
          actions[filePath] = "remove";
        }
      });

    [...commit.added, ...commit.modified]
      .filter((filePath) => filePath.includes(fileExtension))
      .forEach((filePath) => {
        if (!actions[filePath]) {
          actions[filePath] = "update";
        }
      });

    return actions;
  }, {});
};
