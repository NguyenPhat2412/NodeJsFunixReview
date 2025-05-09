const Product = require("../models/product");
const mongodb = require("mongodb");

// tạo id cho product
const ObjectId = mongodb.ObjectId;
// const getDb = require("../util/database").getDb;
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

// add thêm product
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(
    title,
    price,
    imageUrl,
    description,
    null,
    req.user._id
  );

  // tự động tạo id cho product
  product
    .save()
    .then((result) => {
      console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
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
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Lab12
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;

  // cập nhật sản phẩm mới
  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedImageUrl,
    updatedDesc,
    new ObjectId(prodId)
  );
  // const updateProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );

  // tìm kiếm sản phẩm theo id để edit
  product
    .save()
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("Updated Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect("/admin/products");
};

// lấy tất cả sản phẩm
exports.getProducts = (req, res, next) => {
  // lấy tất cả sản phẩm theo id
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
  // Product.fetchAll((products) => {});
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log("Product Deleted");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/admin/products");
};
