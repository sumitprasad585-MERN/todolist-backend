const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken');

const signup = catchAsync(async (req, res, next) => {
  /** Save the user to db, use only safe fields instead of complete request body */
  const newUser = await User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });

  /** Sign the token */
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  /** Send the token */
  const user = Object.assign({}, newUser.toObject());
  delete user.password;
  delete user.active;

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
});

const login = catchAsync(async (req, res, next) => {

});

const protect = catchAsync(async (req, res, next) => {

});

const forgotPassword = catchAsync(async (req, res, next) => {

});

const resetPassword = catchAsync(async (req, res, next) => {

});

const restrictTo = (...roles) => {
  return (req, res, next) => {

  }
};

module.exports = {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  restrictTo
};
