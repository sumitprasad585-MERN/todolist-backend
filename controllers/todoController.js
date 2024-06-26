const catchAsync = require("../utils/catchAsync");

const getAllTodos = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success'
  });
});

const getTodo = catchAsync(async (req, res, next) => {

});

const createTodo = catchAsync(async (req, res, next) => {

});

const updateTodo = catchAsync(async (req, res, next) => {

});

const deleteTodo = catchAsync(async (req, res, next) => {

});

module.exports = {
  getAllTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo
};
