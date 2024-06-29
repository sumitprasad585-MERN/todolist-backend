const express = require('express');
const { signup, login, protect, forgotPassword, resetPassword, updatePassword } = require('../controllers/authController');
const { getAllUsers, getUser } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:resetToken', resetPassword);
router.patch('/updatePassword', protect, updatePassword);


router.route('/')
      .get(getAllUsers)

router.route('/:id')
      .get(getUser);

module.exports = router;
