const express = require("express");
const app = express();
const path = require("path");

app.use(express.static("public"));

app.use("/", (req, res, next) => {
  res.send("<p>The Middleware that handles just</p>");
  next();
});
app.use("users", (req, res, next) => {
  res.send("<p>The Middleware that handles just /users</p>");
});
app.listen(3000);
