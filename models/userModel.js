const mongoose = require('mongoose');
const validator = require('validator');


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
    minLength: [8, 'Password must contain at least 8 characters']
  },
  confirmPassword: {
    type: String,
    required: [true, 'Field confirmPassword is required!'],
    //Works only on save!
    validate: {
      validator: function(el) {
        return el === this.password;
      }
    }
  }
});

module.exports = mongoose.model('User', userSchema);