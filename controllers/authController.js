const User = require("../models/userModel");
const AppError = require("../utils/appError");
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
  const { username, email, password } = req.body;
  let user  = null;

  /** Find the user, the user can login with either username or email */
  if (username) {
    user = await User.findOne({ username }).select('+password');
  } else {
    user = await User.findOne({ email }).select('+password');
  }

  /** Check if the password is correct, only if user is found */
  let correct = false;
  if (user) {
    correct =  await user.verifyPassword(password, user.password);
  }

  /** Return 400 if incorrect credentials or user not found */
  if (!user || !correct) {
    return next(new AppError(400, 'Incorrect credentials'));
  }

  /** Sign the token */
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  /** Send the token */
  res.status(200).json({
    status: 'success',
    token
  });
});

const protect = catchAsync(async (req, res, next) => {
  /** Check if the bearer token is passed with the request */
  let { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer'))
    token = authorization.split(' ')[1];

  if (!token)
    return next(new AppError(401, 'You are not logged in, please login'));

  /** Verify the token. If token is malformed, then error would be thrown while decoding */
  const decoded = await (jwt.verify)(token, process.env.JWT_SECRET);

  /** Check if user still exists and not deleted */
  const user = await User.findById(decoded.id);

  if (!user)
    return next(new AppError(401, 'User deleted'));

  /** Check if password was changed after issuing the token */
  const passwordWasChanged = user.didPasswordChange(decoded.iat);
  if (passwordWasChanged)
    return next(new AppError(401, 'Password was changed, please login with new credentials'));

  /** Add the user on the request object and grant access */
  req.user = user;
  next();
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
