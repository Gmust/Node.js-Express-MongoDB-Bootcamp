const User = require('./../models/userModel');
const catchAsync = require('./../utils/cathcAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {

  const data = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users: data
    }
  });

});