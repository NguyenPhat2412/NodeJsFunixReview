const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { check, body } = require("express-validator");
const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// // /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title")
      .isString()
      .isAlphanumeric()
      .isLength({ min: 3 })
      .trim()
      .withMessage("Please enter a valid title"),
    body("imageUrl").isURL().withMessage("Please enter a valid image URL"),
    body("price")
      .isFloat()
      .withMessage("Please enter a valid price - numeric value"),
    body("description")
      .isLength({ min: 5, max: 400 })
      .trim()
      .withMessage("Please enter a valid description (min:5, max:400)"),
  ],
  isAuth,
  adminController.postAddProduct
);

// // /admin/edit-product => GET
router.get(
  "/edit-product/:productId",
  [
    body("title")
      .isString()
      .isAlphanumeric()
      .isLength({ min: 3 })
      .trim()
      .withMessage("Please enter a valid title"),
    body("imageUrl").isURL().withMessage("Please enter a valid image URL"),
    body("price")
      .isFloat()
      .withMessage("Please enter a valid price - numeric value"),
    body("description")
      .isLength({ min: 5, max: 400 })
      .trim()
      .withMessage("Please enter a valid description (min:5, max:400)"),
  ],
  isAuth,
  adminController.getEditProduct
);

// // // /admin/edit-product => POST
router.post("/edit-product", isAuth, adminController.postEditProduct);

// // /admin/delete
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
