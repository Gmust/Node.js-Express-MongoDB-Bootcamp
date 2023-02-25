const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.updateMyData = catchAsync(async (req, res, next) => {

  // 1) Check if req.body doesn`t consist password or passwordConfirm
  if (req.body.password || req.body.passwordConfirm) {
    next(new AppError('This is update user data method, update password on route: /updateMyPassword', 400));
  }

  // 2) Find and update user
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.setUserInactive = catchAsync(async (req, res, next) => {

  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });

});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);