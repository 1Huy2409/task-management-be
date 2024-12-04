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
    let objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        console.log(objectSearch.regex);
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