const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: [true, 'Tour with this name is already exist']
  },
  rating: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  }
});

module.exports = mongoose.model('Tour', tourSchema);

