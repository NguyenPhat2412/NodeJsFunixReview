const Product = require("../models/product");

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

  // tự động tạo id cho product
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
      // userId: req.user.id, tự động tạo id cho user theo thứ tự
    })
    .then((result) => {
      // console.log(result);
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
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0];
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

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  // const updateProduct = new Product(
  //   prodId,
  //   updatedTitle,
  //   updatedImageUrl,
  //   updatedDesc,
  //   updatedPrice
  // );

  // tìm kiếm sản phẩm theo id để edit
  req.user
    .getProducts({ where: { id: prodId } })
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("Updated Product");
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect("/admin/products");
};

// lấy tất cả sản phẩm
exports.getProducts = (req, res, next) => {
  // lấy tất cả sản phẩm theo id
  req.user
    .getProducts()
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
