require("dotenv").config()
const express = require("express");
const database = require("./config/database");
const routesApiVer1 = require("./api/v1/routes/index.route")
const app = express();
const port = process.env.port;
//ket noi database
database.connect();

// route api version 1
routesApiVer1(app);
app.listen(port, ()=> {
    console.log(`app listening on ${port}`)
})