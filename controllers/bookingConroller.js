const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerFactory');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


exports.getCheckoutSession = catchAsync(async (req, res, next) => {

  const tour = await Tour.findById(req.params.tourId);

  if (!tour) next();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    //success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
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

/*exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { price, tour, user } = req.query;

  if (!price && !tour && !user) return next();

  await Booking.create({ price, tour, user });

  res.redirect(req.originalUrl.split('?')[0]);

});*/

exports.getBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.create(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

const createBookingCheckout = async (sessionData) => {
  const tour = sessionData.client_reference_id;
  const user = await User.findOne(sessionData.customer_email);
  const price = sessionData.line_items[0].price_data.unit_amount;

  await Booking.create({ tour, user, price });

};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.WEBHOOK_SECRET_KEY);
  } catch (e) {
    return res.status(400).send(`Webhook Error: ${e.error}`);
  }

  if (event.type === 'checkout.session.completed') createBookingCheckout(event.data.object);

  res.status(200).json({
    received: true
  });
};