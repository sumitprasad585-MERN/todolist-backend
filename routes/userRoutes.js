const express = require('express');
const { signup, login, protect, forgotPassword, resetPassword, updatePassword, restrictTo } = require('../controllers/authController');
const { getAllUsers, getUser, updateMe, deleteMe } = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 *  tags:
 *    name: Authentication
 *    description: Endpoints related to user Authentication
 */

/**
 * @swagger
 *  /api/v1/users/signup:
 *    post:
 *      summary: Sign Up
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                  required: true
 *                password:
 *                  type: string
 *                  required: true
 *                confirmPassword:
 *                  type: string
 *                  required: true
 *      responses:
 *        201:
 *          description: User created successfully
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Internal Server Error
 */
router.post('/signup', signup);

/**
 * @swagger
 *  /api/v1/users/login:
 *    post:
 *      summary: Login by entering credentials
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  required: true
 *                password:
 *                   type: string
 *                   required: true
 *      responses:
 *        200:
 *          description: Login success
 *        400:
 *          description: Invalid credentials
 *        500:
 *          description: Internal Server error
 */
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:resetToken', resetPassword);
router.patch('/updatePassword', protect, updatePassword);


router.route('/')
      .get(protect, restrictTo('admin', 'developer'), getAllUsers)

router.route('/:id')
      .get(protect, restrictTo('admin', 'developer'), getUser)
      .patch(protect, updateMe)
      .delete(protect, deleteMe);

module.exports = router;
