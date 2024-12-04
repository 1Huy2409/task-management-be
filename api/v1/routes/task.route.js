const express = require("express");
const router = express.Router();
const controller = require("../controller/task.controller")
// [GET] /api/v1/taskss
router.get("/", controller.index);
// [GET] /api/v1/tasks/detail/:id
router.get("/detail/:id", controller.detail);
// [PATCH] /api/v1/tasks/change-status/:id
router.patch("/change-status/:id", controller.changeStatus);
// [PATCH] /api/v1/tasks/change-multi
router.patch("/change-multi", controller.changeMulti);
module.exports = router
