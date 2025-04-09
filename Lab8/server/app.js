const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
app.use(cors()); // cho phep request tu client
app.use(bodyParser.json());

const productsController = require("./controllers/product");
const cartController = require("./controllers/cart");

// Route lay sach
app.get("/products", productsController.getProducts); // get danh sach san pham

// Route lay san pham
// app.get("/add-product", productsController.getAddProduct); // get danh sach san pham
app.post("/cart", cartController.postAddToCart); // post danh sach san pham

// Route lay danh sach san pham trong cart
app.get("/cart", cartController.getCart); // get danh sach san pham trong cart

// Route them san pham
app.post("/add-product", productsController.postAddProduct); // post danh sach san pham

// Route chay o post 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
