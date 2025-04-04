// Lab4.2

const express = require("express");
const app = express();
const path = require("path");

app.use(express.static("views"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/users", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "users.html"));
});
app.listen(3001);
