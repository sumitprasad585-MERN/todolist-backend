const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');
const { promisify } = require('util');

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
    minLength: [3, 'username must be atleast 3 character long'],
    unique: true,
    sparse: true
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

/** pre save hook to update the passwordChangedAt field when password is changed */
userSchema.pre('save', function (next) {
  /** 'this' refers to document here */
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; /* password change should happen before new jwt token issue */
  next();
})

/** Instance method on user schema to check if password is correct */
userSchema.methods.verifyPassword = async function (userPassword, dbPassword) {
  /** 'this' refers to document here*/
  const correct = await promisify(bcrypt.compare)(userPassword, dbPassword);
  return correct;
};

/** Instance method on user schema to check if password was changed after issuing the token*/
userSchema.methods.didPasswordChange = function (issuedJwtTimestamp) {
  /** 'this' refers to document here */
  if (this.passwordChangedAt) {
    const changedPasswordTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return changedPasswordTimestamp > issuedJwtTimestamp;
  }

  return false;
};

/** Instance method on user schema to create password reset token */
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const validForHours = 1;
  this.passwordResetToken = hashedToken;
  this.passwordResetTokenExpiresAt = Date.now() + 1000 * 60 * 60 * validForHours;

  return resetToken;
};

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
