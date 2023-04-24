const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,
  token,
  posts,
  logout,
} = require("./user.Controller");
const { verifyToken } = require("../../middleware/authMiddleware");

router.route("/sign-up").post(registerUser);

// router.route("/login").get(verifyToken, login);
router.route("/sign-in").post(login);

// test
router.route("/token").get(token);

router.route("/posts").get(verifyToken, posts);

// router.route("/delete").get(verifyToken, logout);

module.exports = router;
