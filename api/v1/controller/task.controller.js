const Task = require("../models/task.model")

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    const objectSort = {};
    if (req.query.sortKey && req.query.sortValue) {
        objectSort[req.query.sortKey] = req.query.sortValue;
    }
    console.log(objectSort);
    const tasks = await Task.find(find).sort(objectSort);
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