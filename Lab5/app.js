const express = require("express");
const app = express();
const path = require("path");

// const ejs = require("ejs");

// dùng pug
app.set("view engine", "pug");
// thiet lap thu muc views
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

// thiet lap cac duong dan
app.get("/", (req, res) => {
  res.render("shop");
});
app.get("/addproduct", (req, res) => {
  res.render("addProduct");
});

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(3000);
