const fs = require("fs");

const path = require("path");

// tao bien toan cuc
const p = path.join(
  path.dirname(process.mainModule.filename || process.execPath),
  "data",
  "products.json" // ten file de luu tru san pham
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]); // neu co loi thi tra ve mang rong
    } else {
      cb(JSON.parse(fileContent)); // neu khong co loi thi tra ve du lieu trong file
    }
  });
};

module.exports = class Product {
  // tao thuoc tinh cho san pham
  constructor(title, image, price, description) {
    this.title = title;
    this.image = image;
    this.price = price;
    this.description = description;
  }

  // luu san pham vao database
  save() {
    this.id = Math.floor(Math.random() * 100000 + 1).toString(); // tao id ngau nhien cho san pham
    // lay danh sach san pham tu file
    getProductsFromFile((products) => {
      // them san pham moi vao danh sach
      products.push(this);
      // ghi du lieu vao file
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  // lay danh sach san pham tu file
  static fetchAll(cb) {
    getProductsFromFile(cb); // tra ve danh sach san pham
  }
};
