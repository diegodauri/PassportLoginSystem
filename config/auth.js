module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticate()) {
      return next();
    } else {
      req.flash("error", "Please log in to view this resource");
      res.redirect("/users/login");
    }

  }
};
