const express = require("express");
const router = express.Router();
// const controller = require("../../controller/task.controller")
const Task = require("../../../models/task.model")
router.get("/", async (req, res)=> {
    const tasks = await Task.find(
        {
            deleted: false
        }
    )
    console.log(tasks);
    res.json(tasks);
})
router.get("/detail/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne(
            {
                _id: id
            }
        )
        res.json(task); //tra ve mot chuoi json 
    }
    catch(error)
    {
        res.json("Khong tim thay")
    }
})
module.exports = router
