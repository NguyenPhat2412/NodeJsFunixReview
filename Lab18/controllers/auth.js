const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "pSG.RDaXlkFXSNepUp55c5ctaQ.OJRJUY_fQzc0i7I__Jdnh1wL7sRM3QgrxkBJHxyxbSQ",
    },
  })
);
const { validationResult } = require("express-validator");
exports.getLogin = (req, res, next) => {
  // const isLoggedIn =
  //   req.get("Cookie").split(";")[0].trim().split("=")[1] === "true"; // loggedIn=true
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0]; // lấy ra thông báo đầu tiên
  }
  console.log(req.session); // loggedIn=true
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

// Lab16.1 Thực hiện chức năng Login
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: error.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: error.array(),
    });
  }
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        errorMessage: error.array()[0].msg,
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: error.array(),
      });
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true; // isLoggedIn = true
          req.session.user = user; // user = user
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        res.status(422).render("auth/login", {
          pageTitle: "Login",
          path: "/login",
          errorMessage: error.array()[0].msg,
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/login");
      });

    // req.session.user = user; // user = user
    // req.session.isLoggedIn = true; // isLoggedIn = true
    // res.redirect("/");
    // // req.isLoggedIn = true; // boolean
    // const { email, password } = req.body;
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

// signup
exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0]; // lấy ra thông báo đầu tiên
  } else {
    message = null; // khong co thong bao
  }
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  console.log("Email:", email);
  console.log("Password:", password);
  console.log("Confirm Password:", confirmPassword);

  // Validate email and password
  if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      path: "/signup",
      errorMessage: "Please enter a valid email and password.",
      oldInput: {
        email: email || "",
        password: password || "",
        confirmPassword: confirmPassword || "",
      },
      validationErrors: error.array(),
    });
  }
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error.array()[0].msg);
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      path: "/signup",
      errorMessage: error.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: error.array(),
    });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      // send mail
      // return transporter.sendMail({
      //   to: email,
      //   from: "masterrio2412@gmail.com",
      //   subject: "Signup succeeded!",
      //   html: "<h1>You successfully signed up!</h1>",
      // });
    })
    .catch((err) => {
      const error = new Error(err);
      // Xây dựng mã thông báo lỗi
      error.httpStatusCode = 500;
      return next(error);
    });
};
