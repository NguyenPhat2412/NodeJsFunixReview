const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const User = require("../models/user");

const shopController = require("../controllers/shop");
const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password", "Please enter a password with only numbers and text.")
      .isAlphanumeric()
      .isLength({ min: 8 })
      .trim(),
  ],
  authController.postLogin
);

router.get("/", shopController.getIndex);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage(
        "Please enter a password with a least 8 characters and only numbers"
      )
      .isAlphanumeric()
      .trim(), // loai bo khoang trang
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password have to match!");
        }
        // Neu khong co loi thi tra ve true
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

module.exports = router;
