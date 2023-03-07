const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data --- ${errors.join('. ')}`;
  return new AppError(message, 400);

};

const handleJWTError = (err) => new AppError('Invalid token! Please log in again!', 401);

const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate filed value  ${value}. Use another instead`;
  return new AppError(message, 400);
};

const handleJWTExpiredError = (err) => new AppError('Your token has expired! Try log in again', 401);

const sendDevError = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // B) RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const sendProdError = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 400;

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {

    let error = Object.create(err);

    if (err.name == 'CastError') error = handleCastErrorDB(err);
    if (err.code == '11000') error = handleDuplicateFieldsDB(err);
    if (err.name == 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name == 'JsonWebTokenError') error = handleJWTError(err);
    if (err.name == 'TokenExpiredError') error = handleJWTExpiredError(err);

    sendProdError(error, req, res);

  }
};