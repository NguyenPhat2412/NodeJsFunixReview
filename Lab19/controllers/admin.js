const Product = require("../models/product");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const fileHelper = require("../util/file");

const { validationResult } = require("express-validator");

// const getDb = require("../util/database").getDb;
exports.getAddProduct = (req, res, next) => {
  // Kiểm tra xem người dùng đã đăng nhập hay chưa, bảo vệ trang này khi người dùng chưa đăng nhập
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/edit-product",
    editing: false,
    hasError: false,
    product: {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    },
    errorMessage: null,
    validationErrors: [],
  });
};

// add thêm product
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title.trim();
  const image = req.file;
  const price = req.body.price.trim();
  const description = req.body.description.trim();
  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: "Attached file is not an image.",
      validationErrors: [],
    });
  }
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      validationErrors: errors.array(),
    });
  }
  const imageUrl = image.path;
  const product = new Product({
    _id: new mongoose.Types.ObjectId(), // tạo id cho product
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user, // lấy id của user
  });

  // in product ra console de kiem tra
  console.log(product);

  // tự động tạo id cho product
  product
    .save()
    .then((result) => {
      console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // console.log(err);
      // res.redirect("/500");
      const error = new Error(err);
      // Xây dựng mã thông báo lỗi
      error.httpStatusCode = 500;
      return next(error);
    });

  // tương đương cái bên dưới
  // Product.create({
  //   title: title,
  //   price: price,
  //   imageUrl: imageUrl,
  //   description: description,
  // })
  //   .then((result) => {
  //     console.log("Created Product");
  //     res.redirect("/admin/products");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; // true of false
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId; // tạo ra id cho product

  // Tìm kiếm id trong product
  Product.findById(prodId)
    // Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode, // this is for the edit product
        product: product,
        hasError: false,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      // Xây dựng mã thông báo lỗi
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Lab12
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true, // this is for the edit product
      hasError: true,

      // Chỉ cần cập nhật ba thuộc tính trên
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
      },
      errorMessage: error.array()[0].msg,
      validationErrors: error.array(),
    });
  }
  // cập nhật sản phẩm mới
  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (image) {
        fileHelper.deleteFile(product.imageUrl); // xóa file cũ
        product.imageUrl = image.path;
      }
      return product.save();
    })

    .then((result) => {
      console.log("Updated Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      // Xây dựng mã thông báo lỗi
      error.httpStatusCode = 500;
      return next(error);
    });

  res.redirect("/admin/products");
};

// lấy tất cả sản phẩm
exports.getProducts = (req, res, next) => {
  // lấy tất cả sản phẩm theo id
  Product.find()
    // .select("title price -_id ") // chỉ lấy title và price
    // .populate("userId", "name") // tìm kiếm theo id trong product
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      // Xây dựng mã thông báo lỗi
      error.httpStatusCode = 500;
      return next(error);
    });
  // Product.fetchAll((products) => {});
};

// Lab14.2
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found."));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.findByIdAndDelete(prodId);
    })
    .then((result) => {
      console.log("Product Deleted");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      // Xây dựng mã thông báo lỗi
      error.httpStatusCode = 500;
      return next(error);
    });
  res.redirect("/admin/products");
};
