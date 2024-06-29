const express = require('express');
const { signup, login, protect, forgotPassword, resetPassword, updatePassword, restrictTo } = require('../controllers/authController');
const { getAllUsers, getUser, updateMe, deleteMe } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
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
