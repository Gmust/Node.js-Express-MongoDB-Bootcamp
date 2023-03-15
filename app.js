const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const compression = require('compression');

const viewRouter = require('./routes/viewRoutes');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Security http headers
const scriptSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://js.stripe.com',
  'https://m.stripe.network',
  'https://*.cloudflare.com'
];
const styleSrcUrls = [
  'https://unpkg.com/',
  'https://tile.openstreetmap.org',
  'https://fonts.googleapis.com/'
];
const connectSrcUrls = [
  'https://unpkg.com',
  'https://tile.openstreetmap.org',
  'https://*.stripe.com',
  'https://bundle.js:*',
  'ws://127.0.0.1:*/'
];
const fontSrcUrls = ['fonts.googleapis.com', 'fonts.gstatic.com'];

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ['\'self\'', 'data:', 'blob:', 'https:', 'ws:'],
    baseUri: ['\'self\''],
    fontSrc: ['\'self\'', ...fontSrcUrls],
    scriptSrc: ['\'self\'', 'https:', 'http:', 'blob:', ...scriptSrcUrls],
    frameSrc: ['\'self\'', 'https://js.stripe.com'],
    objectSrc: ['\'none\''],
    styleSrc: ['\'self\'', '\'unsafe-inline\'', ...styleSrcUrls],
    workerSrc: ['\'self\'', 'blob:', 'https://m.stripe.network'],
    childSrc: ['\'self\'', 'blob:'],
    imgSrc: ['\'self\'', 'blob:', 'data:', 'https:'],
    formAction: ['\'self\''],
    connectSrc: [
      '\'self\'',
      '\'unsafe-inline\'',
      'data:',
      'blob:',
      ...connectSrcUrls
    ],
    upgradeInsecureRequests: []
  }
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this ip, try again in an hour!'
});

// Limit request for same api
app.use('/api', apiLimiter);

app.use(compression())

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// For serving static files
app.use(express.static(`${__dirname}/public`));

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['price', 'ratingQuantity', 'ratingsAverage', 'difficulty', 'maxGroupSize', 'duration']
}));

/*app.use((req, res, next) => {
  console.log(req.cookies);
  next();
});*/

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(`Invalid route: ${req.originalUrl}`, 404);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;


