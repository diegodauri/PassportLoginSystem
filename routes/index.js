// jshint esversion: 6
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get("/", function(req, res) {
  res.render("welcome");
});

router.get("/dashboard", ensureAuthenticated, function(req, res) {
  res.render("dashboard", {name: req.user.name});
});

module.exports = router;
