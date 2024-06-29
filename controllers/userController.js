const User = require("../models/userModel");
const ApiFeatures = require("../utils/ApiFeatures");
const AppError = require("../utils/appError");
const jwt = require('jsonwebtoken');
const catchAsync = require("../utils/catchAsync");

const getAllUsers = catchAsync(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(User.find({}), req.query)
  const users = await apiFeatures.query;
  res.status(200).json({
    status: 'success',
    length: users.length,
    data: {
      users
    }
  });
});

const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(new AppError(404, 'User not found'));

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

const createSafeObj = (requestBody, ...allowedFields) => {
  let safeObj = {};
  Object.keys(requestBody).forEach(current => {
    if (allowedFields.includes(current))
      safeObj[current] = requestBody[current];
  });

  return safeObj;
};

const updateMe = catchAsync(async (req, res, next) => {
  /* User should use dedicated update password resource for updating password */
  if (req.body.password)
    return next(new AppError(400, 'Please use /updatePassword route for updating password'));

  /** Do not allow user to update everything and allow only updating the safe fields */
  const safeObj = createSafeObj(req.body, 'name', 'username');

  /** Update the user */
  const updated = await User.findByIdAndUpdate(req.user._id, safeObj, {
    new: true,
    runValidators: true
  });

  /** Sign the token */
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  /** Send the token */
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: updated
    }
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  /** User is already authenticated, set the active status of user to false. Please note GDPR regulations */
  const user = req.user;
  user.active = false;
  await user.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getAllUsers,
  getUser,
  updateMe,
  deleteMe
};
