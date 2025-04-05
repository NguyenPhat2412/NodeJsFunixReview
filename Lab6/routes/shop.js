const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  const products = adminData.product;
  res.render("shop", {
    prods: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0, // tra ve ket qua la true hoac false
    activeShop: true,
    productCSS: true,
  });
});

module.exports = router;
