const express = require("express");
const router = express.Router();
const User = require("../models/User");
const permission = require("../config/permission");
//registration form page
router.get("/", (req, res) => {
  res.render("register");
});
//post data for registration
router.post("/signup", (req, res) => {
  let user = {
    name: req.body.name,
    role: req.body.role,
    email: req.body.email,
    password: req.body.password,
    address: {
      city: req.body.city,
      zip: req.body.zip,
      street: req.body.street,
      country: req.body.country
    }
  };
  req.check("name", "User Name is empty").notEmpty();
  req.check("email", "Please Give a valid Email").isEmail();
  req
    .check("password", "Password is invalid. It must be 6 character long")
    .isLength({ min: 6 });

  // store all validation errors in a variable from request
  const errors = req.validationErrors();
  if (errors) {
    res.render("register", {
      errors: errors
    });
  } else {
    const newUser = new User(user).save((err, data) => {
      if (err) throw err;
      res.redirect("/login");
    });
  }
});
//login form page
router.get("/login", (req, res) => {
  res.render("login");
});
//check login authentication for local
router.post("/login/check", permission.checkLogin, (req, res) => {
  let user = {
    email: req.body.email,
    password: req.body.password
  };
  const query = { email: user.email };
  User.findOne(query, (err, data) => {
    if (err) throw err;
    if (user.password === data.password) {
      req.session.role = data.role;
      req.session.save();
      console.log(req.session);
      res.render("check", {
        role: data
      });
    } else {
      res.json("Wrong Password");
    }
  });
});
//userlist page
router.get("/user/list", permission, (req, res) => {
  let userList = User.find();
  userList.exec((err, users) => {
    // console.log(req.session.role);
    if (err) throw err;
    res.render("list", {
      users: users
    });
  });
});
//logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//delete user id
router.get("/user/delete/:id", (req, res) => {
  let id = req.params.id;
  User.findByIdAndDelete(id, (err, data) => {
    if (err) throw err;
    console.log(data);
    res.redirect("/user/list");
  });
});
router.get("/user/info/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id, (err, data) => {
    if (err) throw err;
    console.log(data);

    res.render("info", {
      users: data
    });
  });
});
module.exports = router;
