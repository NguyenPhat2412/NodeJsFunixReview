// path: Module co san trong nodejs lam viec voi duong dan thu muc, file
const path = require("path");

// express: Fw manh me de xay dung web server trong nodejs
const express = require("express");

// Middleware de phan tich parse du lieu tu post request (duoi dang form hoac json)
const bodyParser = require("body-parser");

// tao mot instance cua express app de cau hinh server va dinh nghia cac route
const app = express();

// dung pug, la template engine giup render html dong
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views")); // truy cap vao thu muc views la mot duong dan tuyet doi

app.use(bodyParser.urlencoded({ extended: false })); // giup xu ly du lieu ti form
app.use(express.static(path.join(__dirname, "public"))); // cho phep truy cap den cac file tĩnh trong thu muc public

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use("/admin", adminData.routes);
app.use(shopRoutes);

// middleware xu lu cac duong dan ko ton tai
app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000);
