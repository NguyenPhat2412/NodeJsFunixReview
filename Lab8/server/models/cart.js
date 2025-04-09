const fs = require("fs");
const path = require("path");

// Xác định đường dẫn tới file cart.json
const p = path.join(
  path.dirname(process.mainModule.filename || process.execPath),
  "data",
  "cart.json" // tên file để lưu trữ sản phẩm
);

// hàm đọc dữ liệu từ file cart.json
const getCartFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err || fileContent.length === 0) {
      // Nếu file chưa tồn tại, trả về mảng rỗng
      cb({ products: [], totalPrice: 0 });
    } else {
      try {
        cb(JSON.parse(fileContent));
      } catch (e) {
        // Nếu parse lỗi (file rỗng hoặc sai), trả mảng rỗng
        cb({ products: [], totalPrice: 0 });
      }
    }
  });
};

// tạo hàm lấy danh sách sản phẩm từ file
module.exports = class Cart {
  static addProduct(id, productPrice) {
    getCartFromFile((cart) => {
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );

      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products.push(updatedProduct);
      }

      // cap nhat tong gia
      cart.totalPrice += +productPrice;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    getCartFromFile(cb); // trả về danh sách sản phẩm
  }
};
