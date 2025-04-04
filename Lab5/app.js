const express = require("express");
const app = express();
const path = require("path");

const ejs = require("ejs");
// thiet lap thu muc views
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

// thiet lap cac duong dan
app.get("/", (req, res) => {
  res.render("shop.ejs");
});
app.get("/addproduct", (req, res) => {
  res.render("addProduct.ejs");
});

app.listen(3000);
