const express = require('express');
const tourController = require('../controllers/toursController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

tourRouter = express.Router();

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getTours);
tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter.route('/tours-plan/:year').get(tourController.getYearPlan);

tourRouter
  .route('/')
  .get(authController.protectRoutes, tourController.getTours)
  .post(tourController.createTour);

tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.patchTour)
  .delete(authController.protectRoutes, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);


module.exports = tourRouter;

