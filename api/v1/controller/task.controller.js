const Task = require("../models/task.model");
const paginationHelper = require("../../../helper/pagination");
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