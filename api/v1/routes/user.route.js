const express = require("express");
const router = express.Router();
const controller = require("../controller/user.controller")
// [POST] /api/v1/users/register
router.post("/register", controller.register);
// [POST] /api/v1/users/register
router.post("/login", controller.login);
// [POST] /api/v1/users/password/forgot
router.post("/password/forgot", controller.forgotPassword);
// [POST] /api/v1/users/password/otp
router.post("/password/otp", controller.otpPassword);
// [POST] /api/v1/users/password/reset
router.post("/password/reset", controller.resetPassword);
module.exports = router
