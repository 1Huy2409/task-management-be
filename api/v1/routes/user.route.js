const express = require("express");
const router = express.Router();
const controller = require("../controller/user.controller")
// [POST] /api/v1/users/register
router.post("/register", controller.register);
module.exports = router
