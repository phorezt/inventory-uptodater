const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("root"));
app.get("/event-handler", (req, res) => res.send("event handler"));

app.listen(port, () =>
  console.log(`Inventory-UpToDater listening on port ${port}`)
);
