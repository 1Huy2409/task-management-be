const express = require("express");
const router = express.Router();
const controller = require("../controller/user.controller");
const userValidate = require("../validate/user.validate");
const authMiddleware = require("../middlewares/auth.middleware");
const { route } = require("./task.route");
// [POST] /api/v1/users/register
router.post("/register", userValidate.register, controller.register);
// [POST] /api/v1/users/login
router.post("/login", userValidate.login, controller.login);
// [POST] /api/v1/users/password/forgot
router.post(
  "/password/forgot",
  userValidate.forgotPassword,
  controller.forgotPassword
);
// [POST] /api/v1/users/password/otp
router.post("/password/otp", userValidate.otpPassword, controller.otpPassword);
// [POST] /api/v1/users/password/reset
router.post(
  "/password/reset",
  userValidate.resetPassword,
  controller.resetPassword
);
// [GET] /api/v1/users/detail
router.get("/detail", authMiddleware.requestAuth, controller.detail);
module.exports = router;
