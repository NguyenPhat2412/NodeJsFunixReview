const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_lab10", "root", "phatdeptrai123", {
  dialect: "mysql",
  host: "localhost",
});
module.exports = sequelize;
