const { promisify } = require('util');
const crypto = require('crypto');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const SendEmail = require('./../utils/email');

const signJwt = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const sendJwt = (user, statusCode, res) => {
  const token = signJwt(user._id);
  const cookieOption = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;

  res.cookie('jwt', token, cookieOption);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user
    }
  });
};

exports.signup = catchAsync(async (req, res) => {


  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url)
  await new SendEmail(newUser, url).sendWelcome();

  sendJwt(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {

  const { email, password } = req.body;

  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Validate email and password

  const user = await User.findOne({ email })
    .select('+password');


  if (user !== null && user.loginBanExpires.toISOString() > new Date(Date.now()).toISOString()) {
    return next(new AppError('Too many login attempts, try again later!', 429));
  }


  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (!(await user.correctPassword(password, user.password))) {
    user.loginAttempts += 1;
    user.save({ validateBeforeSave: false });
    return next(new AppError('Invalid email or password', 401));
  }


  if (user.loginAttempts > process.env.LOGIN_ATTEMPS_LIMIT) {
    user.loginBanExpires = Date.now() + 2000 * 1000;
    user.loginAttempts = 0;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Too many login attempts, try again later!', 429));
  }


  // 3) if everything is  correct send token
  sendJwt(user, 200, res);

});

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
};

exports.protectRoutes = catchAsync(async (req, res, next) => {
  let token;
  // 1) Checking if header exists and if it is - get token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    next(new AppError('You are not logged in! Log in to get access', 401));
  }

  // 2) Verification token
  const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(new AppError('There is no user belonging to this token', 401));
  }

  //4) Check if password changed after issuing of token
  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }


  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check is role lead-guide or admin
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You don`t have permission to perform this action', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {

  // 1) Find user by email and throw an error if it is not exists

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There isn`t user with such email!', 404));
  }

  // 2) Generate reset password token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send token to email
  try {

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    await new SendEmail(user, resetURL).sendResetPassword()
    /*    await SendEmail.send({
          email: user.email,
          subject: 'Your password reset token (valid for 10 min)',
          message
        });*/

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } catch (err) {

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later', 500));

  }


});

exports.resetPassword = catchAsync(async (req, res, next) => {

  // 1) Find user by hashed token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });

  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }
  //2) Set new user data

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  //3) Update changePasswordAt property

  //4) Log user and send jwt

  sendJwt(user, 200, res);

});


exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection

  const user = await User.findById(req.user.id).select('+password');

  // 2) Check is password right

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    next(new AppError('Invalid password'));
  }

  // 3) If so, update user
  user.password = req.body.password;
  user.confirmPassword = req.body.passwordConfirm;
  await user.save();

  // 4) Log in user, send JWT

  sendJwt(user, 200, res);
});


//Only for rendered pages, no errors!
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodedToken = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      // 3) Check if user still exists
      const currentUser = await User.findById(decodedToken.id);
      if (!currentUser) {
        return next();
      }

      //4) Check if password changed after issuing of token
      if (currentUser.changedPasswordAfter(decodedToken.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (e) {
      return next();
    }
  } else {
    next();
  }
});


