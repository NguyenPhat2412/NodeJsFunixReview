const User = require("../models/user");
const bcrypt = require("bcryptjs");
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
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if(password !== confirmPassword){
    return res.status(422).json({
      message: "Password and confirm password do not match.",
    })
  }
  bcrypt.hash(password, 12).then((hashedPassword) => {
    const user = new User({
      email: email,
      password: hashedPassword,  
    })
    return user.save();
  })
  .then((result) => {
    req.session.isLoggedIn = true;
    req.session.user = result;
  })
};
