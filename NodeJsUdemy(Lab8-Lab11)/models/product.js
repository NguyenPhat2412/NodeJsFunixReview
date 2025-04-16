const Sequelize = require("sequelize");

// lấy dữ liệu kết nối với database
const sequelize = require("../util/database");

const Product = sequelize.define("product", {
  // định nghĩa các thuộc tính của bảng product
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },

  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;
