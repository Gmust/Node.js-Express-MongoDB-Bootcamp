const express = require('express');
const tourController = require('../controllers/toursController');

tourRouter = express.Router();


tourRouter
  .route('/')
  .get(tourController.getTours)
  .post( tourController.createTour);

tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.patchTour)
  .delete(tourController.deleteTour);


module.exports = tourRouter;

