const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const { mongoConnect } = require("./util/database");
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://nguyenphat2412:phatdeptrai123@nodejsudemy.hdztbvu.mongodb.net/shoplab14";
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 1000 * 60 * 60 * 24, // 1 day
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  User.findById("64b0f2a1c4d3e5f8c8b7e4a1")
    .then((user) => {
      // thêm phương thức user phương thức này siêu quan trọng
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
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
