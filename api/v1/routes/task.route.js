const express = require("express");
const router = express.Router();
const controller = require("../controller/task.controller")
// [GET] /api/v1/taskss
router.get("/", controller.index);
// [GET] /api/v1/tasks/detail/:id
router.get("/detail/:id", controller.detail);
// [GET] /api/v1/tasks?status=''
module.exports = router
