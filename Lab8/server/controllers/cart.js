// const products = [];
const Cart = require("../models/cart"); // import cart product

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/cart.json");

// Khi bấm nút add to cart thì sẽ post sản phẩm vào cart.json
exports.postAddToCart = (req, res, next) => {
  const product = req.body; // lấy thông tin từ body
  Cart.addProduct(product.id, product.price); // thêm sản phẩm vào cart
  res.redirect("/"); // chuyển hướng về trang shop
};

//  lấy danh sách sản phẩm trong cart
exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    res.json(cart); // trả về danh sách sản phẩm trong cart
  });
};
