const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const product = [];

router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
});

// them tên sách
router.post("/add-product", (req, res, next) => {
  product.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.product = product;
