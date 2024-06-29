const express = require('express');
const { getAllTodos, getTodo, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const { protect } = require('../controllers/authController');

const router = express.Router();

router.route('/')
      .get(protect, getAllTodos)
      .post(protect, createTodo);

router.route('/:id')
      .get(protect, getTodo)
      .patch(protect, updateTodo)
      .delete(protect, deleteTodo);

module.exports = router;
