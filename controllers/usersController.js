const User = require('./../models/userModel');
const catchAsync = require('./../utils/cathcAsync');
const AppError = require('./../utils/appError');


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const data = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users: data
    }
  });

});

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