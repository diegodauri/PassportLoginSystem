// jshint esversion: 6
const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');

// User model
const User = require("../models/User");

router.get("/login", function(req, res) {
  res.render("login", {
    errors: [],
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg")
  });
});

router.get("/register", function(req, res) {
  res.render("register", {
    errors: [],
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg")
  });
});

router.post("/register", function(req, res) {
  const {
    name,
    email,
    password,
    password2
  } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({
      msg: "Please fill in all fields"
    });
  }

  if (password !== password2) {
    errors.push({
      msg: "Passwords do not match"
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: "Password should be at least 6 characters"
    });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({
      email: email
    }, function(err, user) {
      if (user) {
        errors.push({
          msg: "Email is already registred"
        });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        //Hash password
        bcrypt.hash(password, 10, function(err, hashedPassword) {
          if (err) throw err;
          newUser.password = hashedPassword;
          newUser.save()
            .then(() => {
              req.flash("success_msg", "You are now registered and can log in.");
              res.redirect("/users/login");
            })
            .catch(err => console.log(err));
        });
      }
    });
  }
});

router.post("/login", function(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", function(req, res) {
  req.flash("success_msg", "You are logged out");
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
