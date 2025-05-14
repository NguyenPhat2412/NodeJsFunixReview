const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const MONGODB_URI =
  "mongodb+srv://nguyenphat2412:phatdeptrai123@nodejsudemy.hdztbvu.mongodb.net/Lab21?retryWrites=true&w=majority&appName=nodejsudemy";
const PORT = 8080;

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
// app.user(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH ,DELETE");
  next();
});
app.use(cors());
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
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
