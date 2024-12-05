const User = require("../models/user.model");

module.exports.requestAuth = async (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = await User.findOne(
            {
                token: token,
                deleted: false
            }
        ).select("-password")
        if (!user) {
            res.json(
                {
                    code: 400,
                    message: "Invalid account!"
                }
            )
            return;
        }
        req.user = user;
        next();
    }
    else {
        res.json(
            {
                code: 400,
                message: "Please send request attach token"
            }
        )
    }
}