const Tour = require('./../models/tourModel');
const ApiFeatures = require('./../utils/apifeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.patchTour = factory.updateOne(Tour);
exports.createTour = factory.create(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getYearPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTour: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: { '_id': 0 }
    },
    {
      $sort: { month: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });

});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { latlong, unit, distance } = req.params;
  const [lat, long] = latlong.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6371;

  if (!lat || !long) {
    next(new AppError('Please provide latitude and longitude in the format lat, long', 400));
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistance = catchAsync(async (req, res, next) => {
  const { latlong, unit } = req.params;
  const [lat, long] = latlong.split(',');

  if (!lat || !long) {
    next(new AppError('Please provide latitude and longitude in the format lat, long', 400));
  }


  const distance = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [long * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: unit === 'mi'? 0.000621371  : 0.001
      }
    },
    {
      $project: {
        'distance': 1,
        'name': 1
      }
    }
  ]);



  res.status(200).json({
    status: 'success',
    data: {
      data: distance
    }
  });
});