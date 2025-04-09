const path = require("path");

const express = require("express");

const productsController = require("../controllers/product");

// const rootDir = require("../util/path");

const router = express.Router();

// const product = [];

// tao cac router
router.get("/add-product", productsController.getAddProduct);

// them tên sách
router.post("/add-product", productsController.postAddProduct);

// chỉ xuất lại bộ định tuyến của mình khi tôi đang làm việc đó trong cửa hàng
module.exports = router;
