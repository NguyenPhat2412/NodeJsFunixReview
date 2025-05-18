const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const MONGODB_URI =
  "mongodb+srv://nguyenphat2412:phatdeptrai123@nodejsudemy.hdztbvu.mongodb.net/Lab21?retryWrites=true&w=majority&appName=nodejsudemy";
const PORT = 8080;
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const flash = require("connect-flash");
const multer = require("multer");
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
// const csrf = require("csurf");
// const csrfProtection = csrf();

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
// app.user(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "10mb" })); // application/json
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" })); // application/x-www-form-urlencoded
// app.use(csrfProtection);
app.use(flash());
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend
    credentials: true, // Allow session cookie from browser to pass through
  })
);

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: false, // bắt buộc nếu chạy localhost
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// cấu hình multer để lưu hình ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}.png`);
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

const upload = multer({
  dest: "images",
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
  storage: storage,
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn; // thêm isAuthenticated vào locals
  // res.locals.csrfToken = req.csrfToken(); // thêm csrfToken vào locals
  next();
});

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH ,DELETE");
//   next();
// });
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    message: "Not found",
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    const io = require("socket.io")(server);
    io.on("connection", (socket) => {
      console.log("New client connected");
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
