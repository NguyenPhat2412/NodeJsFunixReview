// const products = [];
const Product = require("../models/product"); // import model product

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/products.json");
// tạo phương thức post để lưu thông tin sản phẩm mới
exports.postAddProduct = (req, res, next) => {
  // products.push({ title: req.body.title });
  const { title, image, price, description } = req.body; // lấy thông tin từ body
  const product = new Product(title, image, price, description); // tạo đối tượng sản phẩm mới
  product.save(); // lưu vào database
  res.redirect("/");
};

// chọn cách lấy sản phẩm
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.json(products); // trả về danh sách sản phẩm
  });
};
