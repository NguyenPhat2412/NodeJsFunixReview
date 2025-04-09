const path = require("path");

const express = require("express");

const productsController = require("../controllers/product");

const router = express.Router();

// trang chu shop
router.get("/", productsController.getProducts);

module.exports = router;
