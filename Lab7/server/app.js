const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
app.use(cors()); // cho phep request tu client
app.use(bodyParser.json());

const productsController = require("./controllers/product");

// Route lay sach
app.get("/products", productsController.getProducts); // get danh sach san pham

// Route lay san pham
// app.get("/add-product", productsController.getAddProduct); // get danh sach san pham

// Route them san pham
app.post("/add-product", productsController.postAddProduct); // post danh sach san pham

// Route chay o post 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
