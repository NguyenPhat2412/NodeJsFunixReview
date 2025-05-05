const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");
const authController = require("../controllers/auth");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/", shopController.getIndex);

router.post("/logout", authController.postLogout);

module.exports = router;
