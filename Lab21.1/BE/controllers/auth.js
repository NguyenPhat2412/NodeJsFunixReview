const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
// const jwt = require("");
const { validationResult } = require("express-validator");

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "A user with this email could not be found.",
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) {
            return res.status(401).json({
              message: "Wrong password!",
            });
          }
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.status(200).json({
              message: "Logged in!",
              userId: user._id.toString(),
              email: user.email,
              username: user.username,
            });
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            message: "Internal server error.",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Internal server error.",
      });
    });
};

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      error: errors.array(),
    });
  }
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password !== confirmPassword) {
    return res.status(422).json({
      message: "Password and confirm password do not match.",
    });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        username: username,
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) => {
      req.session.isLoggedIn = true;
      req.session.user = result;
      return req.session.save((err) => {
        console.log(err);
        res.status(201).json({
          message: "User created!",
          userId: result._id.toString(),
        });
      });
    });
};

// đăng xuất người dùng
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.status(200).json({
      message: "Logged out!",
    });
  });
};

// lấy tất cả bài viết
exports.getPosts = async (req, res, next) => {
  const posts = await Post.find();
  if (!posts) {
    return res.status(404).json({
      message: "No posts found.",
    });
  }
  res.status(200).json({
    message: "Posts fetched successfully.",
    posts: posts,
  });
};

// Lấy 1 bài viết
exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "No post found.",
      });
    }
    res.status(200).json({
      message: "Post fetched successfully.",
      post: post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// Tạo mới bài viết
exports.createPost = async (req, res, next) => {
  // const {title, imageUrl}
  const title = req.body.title;
  const image = req.file;
  const content = req.body.content;

  if (!image) {
    return res.status(422).json({
      message: "No image provided.",
    });
  }
  // tạo url đầy đủ cho ảnh
  const imageUrl = `http://localhost:8080/${image.path.replace(/\\/g, "/")}`;
  const post = new Post({
    title: title,
    imageUrl: imageUrl,
    content: content,
  });
  const result = await post.save();
  if (!result) {
    return res.status(500).json({
      message: "Creating post failed.",
    });
  }
  res.status(201).json({
    message: "Post created successfully.",
    post: result,
  });
};

// Edit bài viết
exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const image = req.file;
  const content = req.body.content;
  const post = await Post.findById(postId).populate("userId");
  if (!post) {
    return res.status(404).json({
      message: "No post found.",
    });
  }
  if (post.userId._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Not authorized.",
    });
  }
  if (image) {
    const imageUrl = image.path.replace(/\\/g, "/");
    post.imageUrl = imageUrl;
  }
  post.title = title;
  post.content = content;
  const result = await post.save();
  if (!result) {
    return res.status(500).json({
      message: "Updating post failed.",
    });
  }
  res.status(200).json({
    message: "Post updated successfully.",
    post: result,
  });
};

// Xóa bài viết
exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          message: "No post found.",
        });
      }
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      if (!result) {
        return res.status(500).json({
          message: "Deleting post failed.",
        });
      }
      res.status(200).json({
        message: "Post deleted successfully.",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Internal server error.",
      });
    });
};

// lấy session user
exports.getCurrentUser = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Not authenticated.",
    });
  }
  const user = req.session.user;
  res.status(200).json({
    message: "User fetched successfully.",
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
    },
  });
};
