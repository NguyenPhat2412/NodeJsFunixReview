const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");
const user = require("../models/user");

const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",

        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      // Xây dựng mã thông báo lỗi
      error.httpStatusCode = 500;
      return next(error);
    }); // Cuối cùng mới catch
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      console.log(products);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      // Xây dựng mã thông báo lỗi
      error.httpStatusCode = 500;
      return next(error);
    }); // Cuối cùng mới catch

  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       pageTitle: "Your Cart",
  //       products: cartProducts,
  //     });
  //   });
  // });
};

// xóa sản phẩm trong cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      // Xây dựng mã thông báo lỗi
      error.httpStatusCode = 500;
      return next(error);
    }); // Cuối cùng mới catch
};

// hàm lấy đơn hàng Lab14.4
exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id }) // tìm kiếm đơn hàng theo id
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

// sửa theo findById
// Lab10.2
exports.getProduct = (req, res, next) => {
  const prodID = req.params.productId;

  // tìm kiếm id trong product
  // findById là phương thức có sẵn trong mongoose
  Product.findById(prodID)
    .then((product) => {
      res.render("shop/product-detail", {
        // fix duong dan
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      // Xây dựng mã thông báo lỗi
      error.httpStatusCode = 500;
      return next(error);
    }); // Cuối cùng mới catch
};

// Hàm tạo đơn hàng
exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      order.save();
    })

    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      // Xây dựng mã thông báo lỗi
      error.httpStatusCode = 500;
      return next(error);
    }); // Cuối cùng mới catch
};

// hàm thêm sản phẩm vào giỏ hàng
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  // khí sử dụng mongodb
  Product.findById(prodId)
    .then((product) => {
      req.user.addToCart(product);
      res.redirect("/cart");
    })
    .then((results) => {
      console.log(results);
    })
    .catch((err) => {
      const error = new Error(err);
      // Xây dựng mã thông báo lỗi
      error.httpStatusCode = 500;
      return next(error);
    });
  // khi sử dụng SQl
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodId } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }

  //     if (product) {
  //       newQuantity = product.cartitems.quantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(prodId);
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .catch((err) => console.log(err));

  // khi sử dụng sequelize
  // console.log(prodId);
  // Product.findByPk(prodId, (product) => {
  //   Cart.addProduct(prodId, product.price);
  // });
  // res.redirect("/cart");
};

// Hàm in pdf
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId).then((order) => {
    if (!order) {
      return next(new Error("No order found."));
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorized"));
    }
    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("data", "invoices", invoiceName);

    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(25).text("This is your invoice", {
      underline: true,
    });

    pdfDoc.text("Order ID: " + orderId);
    order.products.forEach((prod) => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc
        .fontSize(14)
        .text(
          prod.product.title +
            " - " +
            prod.quantity +
            " x " +
            "$" +
            prod.product.price
        );
      pdfDoc.text("__________________________");
      pdfDoc.fontSize(20).text("'Total Price: $" + totalPrice);
    });
    pdfDoc.text("Thank you for your order");
    pdfDoc.end();
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.setHeader("Content-Type", "application/pdf");
    //   res.setHeader(
    //     "Content-Disposition",
    //     'attachment; filename="' + invoiceName + '"'
    //   );
    //   res.send(data);
    // }).catch((err) => {
    //   const error = new Error(err);
    //   error.httpStatusCode = 500;
    //   return next(error);
    // });
    const file = fs.createReadStream(invoicePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="' + invoiceName + '"'
    );
    file.pipe(res);
  });
};
