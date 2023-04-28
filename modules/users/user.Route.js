const express = require("express");
const router = express.Router();
const {
  registerUser,
  login,
  token,
  checkToken,
  logout,
  changePassword,
} = require("./user.Controller");
const { verifyToken } = require("../../middleware/authMiddleware");

router.route("/sign-up").post(registerUser);

// router.route("/login").get(verifyToken, login);
router.route("/sign-in").post(login);

// test
router.route("/token").get(token);

router.route("/posts").get(verifyToken, checkToken);

router.route("/sign-out").get(verifyToken, logout);

router.route("/change-password").post(verifyToken, changePassword);

module.exports = router;
