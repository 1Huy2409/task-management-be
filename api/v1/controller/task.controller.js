const Task = require("../models/task.model");
const paginationHelper = require("../../../helper/pagination");
const searchHelper = require("../../../helper/search");
const { search } = require("../routes/task.route");
const { query } = require("express");
// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };
    // filter status
    if (req.query.status) {
        find.status = req.query.status;
    }
    //end filter status
    // sort by criteria
    const objectSort = {};
    if (req.query.sortKey && req.query.sortValue) {
        objectSort[req.query.sortKey] = req.query.sortValue;
    }
    // end sort by criteria
    // pagination
    let paginationObject = {
        currentPage: 1,
        limitTasks: 2
    }
    const countTasks = await Task.countDocuments(find);
    paginationObject = paginationHelper(req.query, paginationObject, countTasks);    
    // end pagination
    // search
    let objectSearch = {
        keyword: ""
    }
    objectSearch = searchHelper(objectSearch, req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    // end search
    const tasks = await Task.find(find).sort(objectSort).skip(paginationObject.skipTasks).limit(paginationObject.limitTasks);
    res.json(tasks);
}
// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne(
            {
                _id: id
            }
        );
        res.json(task);
    }
    catch(error)
    {
        res.json("Không tìm thấy!");
    }
}
// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const newStatus = req.body.status;
        await Task.updateOne(
            {_id: id},
            {
                status: newStatus
            }
        )
        res.json({
            code: 200,
            message: "Change status successfully!"
        })
    }
    catch(error) {
        res.json(
            {
                code: 400, 
                message: "Change status failed! This ID is not exist!"
            }
        )
    }
}
// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const {ids, key, value} = req.body;
        switch(key) {
            case "status": 
                await Task.updateMany(
                    {
                        _id: {$in: ids}
                    },
                    {
                        status: value
                    }
                )
                res.json(
                    {
                        code: 200, 
                        message: "Change multi status successfully!"
                    }
                )
                break;
            case "delete": 
                await Task.updateMany(
                    {
                        _id: {$in: ids}
                    },
                    {
                        deleted: true,
                        deletedAt: new Date()
                    }
                )
                res.json(
                    {
                        code: 200, 
                        message: "Delete multi task successfully!"
                    }
                )
                break;
            default:
                res.json("Not found");
        }
    }
    catch(error) {
        res.json(
            {
                code: 400,
                message: "Change multi failed!"
            }
        )
    }
}
module.exports.create = async(req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.json(
            {
                code: 200,
                message: "Create task successfully!",
                newTask
            }
        )
    }
    catch(error) {
        res.json(
            {
                code: 400,
                message: "Create task failed!"
            }
        )
    }
}
module.exports.edit = async(req, res) => {
    try{
        const id = req.params.id;
        await Task.updateOne(
            {
                _id: id
            },
            req.body
        )
        res.json(req.body);
    }
    catch(error)
    {
        res.json(
            {
                code: 400, 
                message: "Edit task failed!"
            }
        )
    }
}
module.exports.delete = async(req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne(
            {
                _id: id
            }, 
            {
                deleted: true,
                deletedAt: new Date()
            }
        )
        res.json(
            {
                code: 200,
                message: "Delete task successfully!",
                id: id
            }
        )
    }
    catch(error) {
        res.json(
            {
                code: 400, 
                message: "Delete task failed!"
            }
        )
    }
}