module.exports.register = async (req, res, next) => {
  if (!req.body.fullName) {
    res.json({
      code: 400,
      message: "Please enter your fullName",
    });
    return;
  }
  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Please enter your email",
    });
    return;
  }
  if (!req.body.password) {
    res.json({
      code: 400,
      message: "Please enter your password",
    });
    return;
  }
  next();
};
module.exports.login = async (req, res, next) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Please enter your email",
    });
    return;
  }
  if (!req.body.password) {
    res.json({
      code: 400,
      message: "Please enter your password",
    });
    return;
  }
  next();
};
module.exports.forgotPassword = async (req, res, next) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: "Please enter your email",
    });
    return;
  }
  next();
};
module.exports.otpPassword = async (req, res, next) => {
  if (!req.body.otp) {
    res.json({
      code: 400,
      message: "Please enter your OTP code!",
    });
  }
  next();
};
module.exports.resetPassword = async (req, res, next) => {
  if (!req.body.password) {
    res.json({
      code: 400,
      message: "Please enter your new password!",
    });
  }
  if (!req.body.confirmPassword) {
    res.json({
      code: 400,
      message: "Please confirm your new password!",
    });
  }
  if (req.body.password !== req.body.confirmPassword) {
    res.json({
      code: 400,
      message: "Confirm password failed! Please confirm exactly!",
    });
  }
  next();
};
