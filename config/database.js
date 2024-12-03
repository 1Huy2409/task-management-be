const mongoose = require("mongoose")

module.exports.connect = async () => { //export ra hàm connect tu file database
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected success")
    }
    catch (error) {
        console.log("Connected error")
    }
}
mongoose.connect(process.env.MONGO_URL)