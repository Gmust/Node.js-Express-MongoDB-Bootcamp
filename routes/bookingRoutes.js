const express = require('express');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingConroller');


bookingRouter = express.Router();

bookingRouter.get('/checkout-session/:tourId', authController.protectRoutes, bookingController.getCheckoutSession);

bookingRouter
  .route('/')
  .get(bookingController.getBookings)
  .post(authController.protectRoutes, authController.restrictTo('admin'), bookingController.createBooking);

bookingRouter
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(authController.protectRoutes, authController.restrictTo('admin'), bookingController.updateBooking)
  .delete(authController.protectRoutes, authController.restrictTo('admin'), bookingController.deleteBooking);

module.exports = bookingRouter;
