const User = require("../models/userModel");
const ApiFeatures = require("../utils/ApiFeatures");
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

});

module.exports = {
  getAllUsers,
  getUser
};
