const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
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
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts().then((products) => {
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: products,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
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
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];

      // hàm xóa sản phẩm trong cart
      return product.cartitems.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

// hàm lấy đơn hàng
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
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
  Product.findAll({ where: { id: prodID } })
    .then((product) => {
      res.render("shop/product-detail", {
        // fix duong dan
        product: product[0],
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));

  // Product.findById(prodID)
  //   .then((product) => {})
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

// Hàm tạo đơn hàng
exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user.createOrder().then((order) => {
        return order.addProducts(
          products.map((product) => {
            product.orderitems = { quantity: product.cartitems.quantity };
            return product;
          })
        );
      });
    })
    .then(() => {
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err)); // ✅ Cuối cùng mới catch
};

// hàm thêm sản phẩm vào giỏ hàng
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        newQuantity = product.cartitems.quantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity },
      });
    })
    .catch((err) => console.log(err));

  // console.log(prodId);
  // Product.findByPk(prodId, (product) => {
  //   Cart.addProduct(prodId, product.price);
  // });
  // res.redirect("/cart");
};
