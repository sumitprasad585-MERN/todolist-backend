const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must have a name'],
    maxLength: [40, 'name must not exceed 40 characters']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    validate: [validator.isEmail, 'invalid email'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minLength: [8, 'password must be atleast 8 characters long'],
    select: false
  },
  confirmPassword: {
    type: String,
    validate: {
      message: 'Passwords do not match',
      validator: function (val) {
        /** this refers to document here */
        return this.password === val;
      }
    }
  },
  username: {
    type: String,
    minLength: [3, 'username must be atleast 3 character long']
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'developer', 'admin'],
      message: 'Invalid value for role'
    },
    default: 'user'
  },
  passwordResetToken: String,
  passwordResetTokenExpiresAt: Date,
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

/** Encrypt the password through pre save hook */
userSchema.pre('save', async function (next) {
  /** 'this' refers to the document here */
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

userSchema.index({ email: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
