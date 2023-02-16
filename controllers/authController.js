const User = require('./../models/userModel');
const catchAsync = require('./../utils/cathcAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const signJwt = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res) => {

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });

  const token = signJwt(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {

  const { email, password } = req.body;

  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Validate email and password


  const user = await User.findOne({ email }).select('+password');


  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // 3) if everything is  correct send token
  const token = signJwt(user._id);

  res.status(200).json({
    status: 'success',
    token
  });

});