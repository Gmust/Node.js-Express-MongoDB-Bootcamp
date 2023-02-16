const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
  }
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

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


module.exports = mongoose.model('User', userSchema);