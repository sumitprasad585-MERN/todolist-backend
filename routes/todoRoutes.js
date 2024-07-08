const express = require('express');
const { getAllTodos, getTodo, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const { protect } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 *  tags:
 *    name: Todos
 *    description: Endpoints related to todos
 */


/**
 * @swagger
 *  /api/v1/todos:
 *    get:
 *      summary: Get all todos
 *      tags: [Todos]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        200:
 *          description: Got all todos
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Internal Server Error
 */
router.get('/', protect, getAllTodos);

/**
 * @swagger
 *  /api/v1/todos:
 *    post:
 *      summary: Create a todo
 *      tags: [Todos]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                summary:
 *                  type: string
 *                description:
 *                  type: string
 *              required:
 *                - name
 *                - summary
 *                - description
 *      responses:
 *        201:
 *          description: Todo created successfully
 *        400:
 *          description: Bad request
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Internal Server Error
 */
router.post('/', protect, createTodo);

/**
 * @swagger
 *  /api/v1/todos/{id}:
 *    get:
 *      summary: Get Single Todo
 *      tags: [Todos]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: The id of todo
 *      responses:
 *        200:
 *          description: Got all todos
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Internal Server Error
 */
router.get('/:id', protect, getTodo);

/**
 * @swagger
 *  /api/v1/todos/{id}:
 *    patch:
 *      summary: Update a Todo
 *      tags: [Todos]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: The id of todo to be updated
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                summary:
 *                  type: string
 *                description:
 *                  type: string
 *              required:
 *                - name
 *                - summary
 *                - description
 *      responses:
 *        201:
 *          description: Todo created successfully
 *        400:
 *          description: Bad request
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Internal Server Error
 */
router.patch('/:id', protect, updateTodo);

/**
 * @swagger
 *  /api/v1/todos/{id}:
 *    delete:
 *      summary: Delete a Todo
 *      tags: [Todos]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: The id of todo to be updated
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                summary:
 *                  type: string
 *                description:
 *                  type: string
 *              required:
 *                - name
 *                - summary
 *                - description
 *      responses:
 *        201:
 *          description: Todo created successfully
 *        400:
 *          description: Bad request
 *        401:
 *          description: Unauthorized
 *        500:
 *          description: Internal Server Error
 */
router.delete('/:id', protect, deleteTodo);

module.exports = router;
