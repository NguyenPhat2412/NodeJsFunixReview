const express = require("express");

const router = express.Router();

const feedController = require("../controllers/auth");

const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/login", feedController.postLogin);

router.post("/register", feedController.postSignup);

router.post("/logout", feedController.postLogout);

// Get all Posts
router.get("/posts", feedController.getPosts);

// Get a single Post
router.get("/posts/:postId", feedController.getPost);

// Create a new Post
router.post("/posts", upload.single("image"), feedController.createPost);
// Update a Post
router.put("/posts/:postId", upload.single("image"), feedController.updatePost);

// Delete a Post
router.delete("/posts/:postId", feedController.deletePost);

// lấy current user
router.get("/current-user", feedController.getCurrentUser);

module.exports = router;
