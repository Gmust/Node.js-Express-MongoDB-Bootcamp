const User = require('./../models/userModel');
const catchAsync = require('./../utils/cathcAsync');


exports.signup = catchAsync(async (req, res) => {

  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });

});