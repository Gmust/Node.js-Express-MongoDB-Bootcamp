const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

/*
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
  }
});
*/

const deleteOldPhoto = req => {

  const path = `public/img/users/${req.user.photo}`;

  fs.unlink(path, err => {
    if (err) console.log(err);
  });
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image, please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizePhoto = async (req, res, next) => {
  if (!req.file) next();

  req.file.fileName = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.fileName}`);

  next();
};

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
  if (req.body && req.file) filteredBody.photo = req.file.fileName;

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

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteUserPhoto = (req, res, next) => {
  if (!req.user.photo.includes('default')) deleteOldPhoto(req);
  next();
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);