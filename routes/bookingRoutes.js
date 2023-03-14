const express = require('express');
const authController = require('../controllers/authController')
const bookingController = require('../controllers/bookingConroller');


bookingRouter = express.Router();

bookingRouter.get('/checkout-session/:tourId',authController.protectRoutes,  bookingController.getCheckoutSession);

module.exports = bookingRouter;
