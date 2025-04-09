// const products = [];
const Product = require("../models/product"); // import model product

// tạo controller cho product để add sản phẩm mới
exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

// tạo phương thức post để lưu thông tin sản phẩm mới
exports.postAddProduct = (req, res, next) => {
  // products.push({ title: req.body.title });
  const product = new Product(req.body.title); // Xay dung model product
  product.save(); // lưu vào database
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop", {
      prods: products,
      pageTitle: "Shop",
      path: "/", // duong dan
      hasProducts: products.length > 0, // tra ve ket qua la true hoac false
      activeShop: true,
      productCSS: true,
    });
  });
};
