const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Product {
  constructor(title, price, imageUrl, description, id) {
    this._id = new mongodb.ObjectId(id);
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }
  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // update the product
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static findById(prodID) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodID) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // xóa 1 sản phẩm theo id sử dụng DeleteOne
  static deleteById(prodID) {
    const db = getDb();

    if (!mongodb.ObjectId.isValid(prodID)) {
      console.log("Invalid ID");
      return;
    }
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodID) })
      .then((result) => {
        console.log("Deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
