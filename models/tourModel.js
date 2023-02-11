const mongoose = require('mongoose');


const SIMPLE_TOUR_ERR_MSG = 'A tour must have a';


const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `${SIMPLE_TOUR_ERR_MSG} name`],
    unique: [true, 'Tour with this name is already exist']
  },
  price: {
    type: Number,
    required: [true, `${SIMPLE_TOUR_ERR_MSG} price`]
  },
  duration: {
    type: Number,
    required: [true, `${SIMPLE_TOUR_ERR_MSG} duration`]
  },
  maxGroupSize: {
    type: Number,
    required: [true, `${SIMPLE_TOUR_ERR_MSG} max group sized`]
  },
  difficulty: {
    type: String,
    required: [true, `${SIMPLE_TOUR_ERR_MSG} difficulty`]
  },
  ratingsAverage: {
    type: Number,
    default: 0
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  discountPrice: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, `${SIMPLE_TOUR_ERR_MSG} summary`]
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, `${SIMPLE_TOUR_ERR_MSG} cover image`]
  },
  images: [String],
  createdAt: {
    type: Date,
    default: new Date()
  },
  startDates: [Date],
});

module.exports = mongoose.model('Tour', tourSchema);

