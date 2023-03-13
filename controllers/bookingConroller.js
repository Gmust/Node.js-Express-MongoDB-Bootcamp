const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


exports.getCheckoutSession = catchAsync(async (req, res, next) => {

  const tour = await Tour.findById(req.params.tourID);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
          },
          unit_amount: tour.price * 100
        },
        quantity: 1
      }
    ],
    mode: 'payment'
  });

  res.status(200).json({
    status: 'success',
    session
  });

});