const Tour = require('./../models/tourModel');


class ToursController {

  async getTours(req, res) {
    try {

      const queryObj = { ...req.query };
      const excludedQueries = ['page', 'sort', 'limit', 'fields'];
      excludedQueries.forEach(el => delete queryObj[el]);

      const query = Tour.find(queryObj);


      const tours = await query;

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


}


module.exports = new ToursController();