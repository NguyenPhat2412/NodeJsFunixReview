const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
// const db = require("./util/database");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// tạo mối quan hệ one to many giữa user và product
// onDelete: xóa user thì xóa luôn product
// constrains: không cho phép xóa user nếu còn product
// nếu như xóa bên product thì không xóa bên user
Product.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  // xóa toàn bộ bảng trong database rồi tạo lại từ đầu dựa trên model sequelize
  // sẽ thực hiện việc drop và create table
  .sync({ force: true })
  .then((result) => {
    return User.findByPk(1);
  })

  // tạo user đầu tiên trong database
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Max",
        email: "test@test.com",
        password: "123",
      });
    }
    return user;
  })
  .then((user) => {
    // sẽ in ra user đầu tiên trong database
    // console.log(user);
    // console.log(result);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
