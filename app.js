const express = require('express');
const morgan = require('morgan');
const rateLimiter = require('express-rate-limit');
const dotenv = require('dotenv').config();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this ip, try again in an hour!'
});


app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api', apiLimiter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(`Invalid route: ${req.originalUrl}`, 404);
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;


