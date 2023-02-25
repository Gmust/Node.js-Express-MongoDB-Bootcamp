const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const dotenv = require('dotenv').config();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Security http headers
app.use(helmet());

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

// Body parsing
app.use(express.json());

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

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(`Invalid route: ${req.originalUrl}`, 404);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;


