const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://nguyenphat2412:phatdeptrai123@nodejsudemy.hdztbvu.mongodb.net/shoplab14";
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
  // expires: 1000 * 60 * 60 * 24, // 1 day
});

const csrfProtection = csrf();

// Cấu hình multer để lưu trữ file
const fileStorage = multer.diskStorage({
  // lưu trữ file vào thư mục images
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    cb(null, timestamp + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { time } = require("console");

app.use(bodyParser.urlencoded({ extended: false }));

// thêm chức năng lọc
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
); // for parsing multipart/form-data

app.use(express.static(path.join(__dirname, "public")));
// thêm đường dẫn tĩnh cho thư mục public
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: false, // bắt buộc nếu chạy localhost
      // maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn; // thêm isAuthenticated vào locals
  res.locals.csrfToken = req.csrfToken(); // thêm csrfToken vào locals
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      // thêm phương thức user phương thức này siêu quan trọng
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  const status = 500;
  console.error("💥 ERROR CAUGHT:", error);
  console.error("Session exists?", !!req.session);
  res.status(status).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    const error = new Error(err);
    // Xây dựng mã thông báo lỗi
    error.httpStatusCode = 500;
    return next(error);
  });
