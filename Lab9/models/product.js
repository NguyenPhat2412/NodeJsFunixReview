const Cart = require("./cart");
const db = require("../util/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      "INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)",
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  // xóa sản phẩm
  static deleteById(id) {}

  // lấy tất cả sản phẩm
  static fetchAll() {
    return db.execute("SELECT * FROM products");
    // .then((result) => {
    //   result[0];
    // })
    // .catch((err) => {
    //   console.error(err);
    // });
  }

  // tìm sản phẩm theo id
  static findById(id) {
    return db.execute(" SELECT * FROM products WHERE products.id = ?", [id]);
  }
};
