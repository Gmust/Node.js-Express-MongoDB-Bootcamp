const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to the tour']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to the user']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  },
  price: {
    type: Number,
    required: [true, 'Booking must have price']
  }
});

bookingSchema.pre(/^find/, function(next) {
  this
    .populate('user')
    .populate({ path: 'tour', select: 'name' });
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);