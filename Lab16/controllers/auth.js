const User = require("../models/user");
const bcrypt = require("bcryptjs");
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
  });
};

// Lab16.1 Thực hiện chức năng Login
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  // Lab16.2 Cung cấp lỗi
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
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
        res.redirect("/login");
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
  }
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      return bcrypt
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
          console.log(result);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
