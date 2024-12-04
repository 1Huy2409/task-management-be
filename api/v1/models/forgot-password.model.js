const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
    {       
        email: String,
        otp: String,
        expireAt: {
            type: Date,
            expires: 180
        }
    }, 
    {
        timestamps: true
    }
);
const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password"); // forgot-password: tên table trong database

module.exports = ForgotPassword;