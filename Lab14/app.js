const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const { mongoConnect } = require("./util/database");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("680265fdd39fa74612344268")
    .then((user) => {
      // thêm phương thức user phương thức này siêu quan trọng
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://nguyenphat2412:phatdeptrai123@nodejsudemy.hdztbvu.mongodb.net/shoplab14?retryWrites=true&w=majority&appName=nodejsudemy"
  )
  .then((result) => {
    console.log("Connected to MongoDB");

    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Phat",
          email: "masterrio2412@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    // tạo user đầu tiên
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
