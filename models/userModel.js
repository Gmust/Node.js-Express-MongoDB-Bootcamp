const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Field name is required!'],
    maxLength: [20, 'A name must contain less or equal than 40 symbols'],
    validate: {
      validator: function(val) {
        return validator.isAlpha(val, 'en-US', { ignore: ' ' });
      }
    }
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Field email is required!'],
    validate: [validator.isEmail, 'Provide a valid Email']
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Field password is required!'],
    minLength: [8, 'Password must contain at least 8 characters'],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Field confirmPassword is required!'],
    //Works only on save and create!
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
  //Runs this function only in case if it is modified!
  if (!this.isModified('password')) return next();
  //Hash the password
  this.password = await bcrypt.hash(this.password, 12);
  //Delete confirmPassword field from document
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.resetPasswordExpires = new Date().getTime() + 10 * 60 * 1000;

  console.log(resetToken, this.resetPasswordToken);

  return resetToken;
};


module.exports = mongoose.model('User', userSchema);