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
// [POST] /api/v1/tasks/create
router.post("/create", controller.create);
// [PATCH] /api/v1/tasks/edit/:id
router.patch("/edit/:id", controller.edit);
// [DELETE] /api/v1/tasks/delete/:id
router.delete("/delete/:id", controller.delete);
module.exports = router
