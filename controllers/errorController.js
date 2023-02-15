const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  console.log(err);
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data --- ${errors.join('. ')}`;
  return new AppError(message, 400)

};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate filed value  ${value}. Use another instead`;
  return new AppError(message, 400);
};


const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {

    console.error('Error ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something  went wrong!'
    });

  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 400;

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {

    let error = Object.create(err);

    if (err.name == 'CastError') error = handleCastErrorDB(err);
    if (err.code == '11000') error = handleDuplicateFieldsDB(err);
    if (err.name == 'ValidationError') error = handleValidationErrorDB(err);

    sendProdError(error, res);

  }
};