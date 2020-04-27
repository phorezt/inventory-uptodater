const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
console.log(process.env.GITHUB_WEBHOOK_SECRET);

// Functions doing the work
// const validateXGithubEvent = require("./functions/validateXGithubEvent");
const compileActionsFromCommits = require("./functions/compileActionsFromCommits");
const fetchFileContents = require("./functions/fetchFileContents");
const updateInventoryEntity = require("./functions/updateInventoryEntity");

// Config, to be env vars
const port = 3000;
const entityFileExtention = ".backstage.json";

app.use(express.json());

app.get("/", (req, res) => res.send("Hello from the Inventory-UpToDater!"));

app.post(
  "/event-handler",
  // validateXGithubEvent({
  //   secret: process.env.GITHUB_WEBHOOK_SECRET,
  // }),
  // TODO: handleCheckEvents,
  async function handlePushEvents(req, res, next) {
    if (req.headers["x-github-event"] !== "push") {
      next();
    } else {
      // Go through all commits in the push payload and find "added", "modified"
      // and "removed" files that end with entityFileExtention.
      // Collect actions to be done for each file.
      const fileActions = compileActionsFromCommits(
        entityFileExtention,
        req.body.commits || [req.body.head_commit]
      );
      console.log(fileActions);

      for (let [file, action] of Object.entries(fileActions)) {
        if (action === "remove") {
          // if removals, flag entities with removedSrcFile
          // TODO: How to do this without the contents of the file if we don't index based on org+repo+filepath?
          // removeInventoryEntity(?file?);
          console.log(`flagged ${file} as removed`);
        }
        if (action === "update") {
          // update inventory with new file contents
          const contentURL = `https://raw.githubusercontent.com/${req.body.repository.full_name}/master/${file}`;
          try {
            const content = await fetchFileContents(contentURL);
            await updateInventoryEntity(content.id, content);
          } catch (e) {
            console.error(e);
          }
        }
      }
      res.json({ status: 200 });
    }
  }
);

app.use((err, req, res, next) => {
  if (err) console.error(err);
  res.status(403).send("Request body was not signed or verification failed");
});

app.listen(port, () =>
  console.log(`Inventory-UpToDater listening on port ${port}`)
);
