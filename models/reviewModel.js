const mongoose = require('mongoose');
const validator = require('validator');

const reviewSchema = new mongoose.Schema({
    review: {
      type: String,
      minLength: 40,
      require: [true, 'Review can`t be empty']
    },
    rating: {
      type: Number,
      default: 0,
      min: [1, 'A rating must be more or equal than 1'],
      max: [5, 'A rating must be lower or equal than 5']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: [true, 'Review must belong to the user']
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      require: [true, 'Review must belong to a tour']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Review', reviewSchema);