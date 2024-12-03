require("dotenv").config()
const express = require("express");
const database = require("./config/database");
const app = express();
const port = process.env.port;
//ket noi database
const Task = require("./models/task.model");
database.connect();
app.get("/tasks", async (req, res)=> {
    const tasks = await Task.find(
        {
            deleted: false
        }
    )
    console.log(tasks);
    res.json(tasks);
})
app.get("/tasks/detail/:id", async (req, res) => {
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
app.listen(port, ()=> {
    console.log(`app listening on ${port}`)
})