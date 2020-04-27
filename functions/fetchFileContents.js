const fetch = require("node-fetch");

function parseEntityFileError(e) {
  console.error("parse failed, ", e);
}
function validateEntityFileError(e) {
  console.error("validation failed, ", e);
}

/** fetch the entity file, parse and validate it
 * defaults:
 *   parseEntityFile: JSON.parse
 *   validateEntityFile: identityFn (a=>a)
 */

module.exports = async function fetchFileContents(
  contentURL,
  parseEntityFile = JSON.parse,
  validateEntityFile = (a) => a
) {
  return await fetch(contentURL)
    .then((r) => r.text())
    .then(parseEntityFile, parseEntityFileError) // handle yaml or something else.
    .then(validateEntityFile, validateEntityFileError) // validate the structure of the entityFile
    .catch(console.error);
};
