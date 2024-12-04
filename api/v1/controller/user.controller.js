var md5 = require("md5");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");
const generateHelper = require("../../../helper/generate");
const sendMailHelper = require("../../../helper/sendMail");
// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  req.body.password = md5(req.body.password);
  //kiem tra email da ton tai chua
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (existEmail) {
    res.json({
      code: 400,
      message: "Email đã tồn tại",
    });
  } else {
    const user = new User(req.body);
    await user.save();
    const token = user.token;
    res.cookie("token", token);
    res.json({
      code: 200,
      message: "Đăng ký tài khoản thành công",
      tokenUser: token,
    });
  }
};
// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại!",
    });
    return;
  }
  if (md5(password) !== user.password) {
    res.json({
      code: 400,
      message: "Mật khẩu không đúng!",
    });
    return;
  }
  res.cookie("token", user.token);
  res.json({
    code: 200,
    message: "Đăng nhập thành công",
  });
};
// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại!",
    });
    return;
  }
  const otp = generateHelper.generateRandomNumber(6);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  let subject = "Mã OTP xác nhận mật khẩu";
  let html = `Mã OTP để lấy lại mật khẩu của bạn là ${otp}, hết hạn trong 3 phút`;
  sendMailHelper.sendEmail(email, subject, html);
  res.json({
    code: 200,
    message: "Đã gửi mã OTP qua email!",
  });
};
// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  const otp = req.body.otp;
  const email = req.body.email;
  const forgotPassword = await ForgotPassword.findOne({
    otp: otp,
    email: email,
  });
  if (!forgotPassword) {
    res.json({
      code: 400,
      message: "OTP không hợp lệ",
    });
    return;
  }
  //tra ve cookie cho account do
  const user = await User.findOne({
    email: email,
  });
  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: 200,
    message: "Xác thực OTP thành công!",
    token: token,
  });
};
// [POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;
  const user = await User.findOne({
    token: token,
  });
  if (md5(password) === user.password) {
    res.json({
      code: 400,
      message: "Vui lòng nhập mật khẩu mới khác mật khẩu cũ",
    });
    return;
  }
  await User.updateOne(
    {
      token: token,
    },
    {
      password: md5(password),
    }
  );
  res.json({
    code: 200,
    message: "Đổi mật khẩu thành công",
  });
};
// [GET] /api/v1/users/detail
module.exports.detail = async (req, res) => {
  const token = req.cookies.token;
  console.log(token);
  const user = await User.findOne({ token: token, deleted: false }).select("-password -token");
  res.json({
    code: 200,
    message: "Lấy thông tin cá nhân thành công",
    user: user
  });
};
