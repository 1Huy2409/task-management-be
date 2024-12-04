require("dotenv").config()
const express = require("express");
const database = require("./config/database");
const routesApiVer1 = require("./api/v1/routes/index.route");
var cors = require('cors');
var cookieParser = require('cookie-parser');
const app = express();
const port = process.env.port;
const bodyParser = require('body-parser')
//ket noi database
database.connect();
app.use(cors());
app.use(bodyParser.json())
app.use(cookieParser())
// route api version 1
routesApiVer1(app);
app.listen(port, ()=> {
    console.log(`app listening on ${port}`)
})