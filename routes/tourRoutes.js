const express = require('express');
const tourController = require('../controllers/toursController');

tourRouter = express.Router();

tourRouter.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getTours);
tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter.route('/tours-plan/:year').get(tourController.getYearPlan);

tourRouter
  .route('/')
  .get(tourController.getTours)
  .post(tourController.createTour);

tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.patchTour)
  .delete(tourController.deleteTour);


module.exports = tourRouter;

