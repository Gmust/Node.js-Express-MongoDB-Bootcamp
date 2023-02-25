const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apifeatures');


exports.deleteOne = Model => catchAsync(async (req, res, next) => {

  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError(`No document found with that ID ${req.params.id}`, 404));
  }

  res.status(204).json({
    status: 'success',
    message: `Document with id = ${req.params.id} successfully deleted`
  });

});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    return next(new AppError(`No document found with that ID ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: doc
    }
  });
});

exports.create = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      document: doc
    }
  });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {

  let query = Model.findById(req.params.id);
  if (popOptions) query = Model.findById(req.params.id).populate(popOptions);

  const doc = await query;

  if (!doc) {
    return next(new AppError(`No document found with that ID ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {

  // To allow  for nested GET routes for reviews on tour
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const features = new ApiFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const doc = await features.query.explain();

  res.status(200).json({
    status: 'success',
    tours: doc.length,
    data: {
      doc
    }
  });
});