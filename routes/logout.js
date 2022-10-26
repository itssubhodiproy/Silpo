const express = require("express");
const route = express.Router();

route.delete("/", function (req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });

module.exports = route;