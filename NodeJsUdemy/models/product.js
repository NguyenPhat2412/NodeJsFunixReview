// Xây dụng model products
// const products = [];

// lưu data trong file bởi model
const fs = require("fs");
const path = require("path");

// tạo biến toàn cục
const p = path.join(
  path.dirname(process.mainModule.filename || process.execPath),
  "data",
  "products.json" // tên file để lưu trữ sản phẩm
);
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]); // trả về mảng rỗng nếu không có file json
    } else {
      cb(JSON.parse(fileContent)); // chuyển đổi từ json sang object
    }
  });
};
module.exports = class Product {
  // tạo thuộc tính cho sản phẩm
  constructor(title) {
    this.title = title;
  }

  // lưu vào database
  save() {
    // gọi hàm lấy file json
    getProductsFromFile((products) => {
      products.push(this); // thêm sản phẩm mới vào mảng
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err); // ghi vào file json
      });
    });
  }

  // lấy tất cả sản phầm
  static fetchAll(cb) {
    getProductsFromFile(cb); // gọi hàm lấy file json
  }
};
