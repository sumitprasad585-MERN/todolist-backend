const Todo = require("../models/todoModel");
const ApiFeatures = require("../utils/ApiFeatures");
const catchAsync = require("../utils/catchAsync");

const getAllTodos = catchAsync(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Todo.find({}), req.query)
                            .enableSearchByFieldsFor('name', 'summary')
                            .filter()
                            .sort()
                            .limitFields()
                            .paginate();

  const todos = await apiFeatures.query;
  res.status(200).json({
    status: 'success',
    length: todos.length,
    data: {
      todos
    }
  });
});

const getTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return res.status(404).json({
      status: 'fail',
      message: 'todo not found'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      todo
    }
  });
});

const createTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.create(req.body);
  return res.status(201).json({
    status: 'success',
    data: {
      todo
    }
  });
});

const updateTodo = catchAsync(async (req, res, next) => {
  const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      todo: updated
    }
  });
});

const deleteTodo = catchAsync(async (req, res, next) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  getAllTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo
};
