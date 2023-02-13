const Tour = require('./../models/tourModel');
const ApiFeatures = require('./../utils/apifeatures');

class ToursController {

  aliasTopTours(req, res, next) {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  }


  async getTours(req, res) {
    try {


      const features = new ApiFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();

      const tours = await features.query;

      res.status(200).json({
        status: 'success',
        data: tours
      });
    } catch (err) {
      res.status(400).json({
        status: 'failed',
        message: err.message
      });

    }
  };


  async createTour(req, res) {
    try {
      const newTour = await Tour.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });

    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  };


  async getTour(req, res) {
    try {
      const tour = await Tour.findById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid ID'
      });
    }
  };

  async patchTour(req, res) {
    try {
      const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      res.status(200).json({
        status: 'success',
        data: {
          tour: updatedTour
        }
      });

    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });

    }
  };

  async deleteTour(req, res) {
    try {
      await Tour.findByIdAndDelete(req.params.id);

      res.status(200).json({
        status: 'success',
        message: `Tour with id=${req.params.id} successfully deleted`
      });

    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  };

  async getTourStats(req, res) {
    try {
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

    } catch (err) {
      res.status(400).json({
        status: 'failed',
        message: err.message
      });

    }
  }

  async getYearPlan(req, res) {
    try {
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

    } catch (err) {
      res.status(400).json({
        status: 'failed',
        message: err.message
      });
    }


  }

}


module.exports = new ToursController();