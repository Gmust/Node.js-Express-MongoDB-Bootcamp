const express = require('express');
const reviewController = require('../controllers/reviewsController');
const authController = require('../controllers/authController');

reviewRouter = express.Router({ mergeParams: true });


reviewRouter.route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protectRoutes,
    authController.restrictTo('user'),
    reviewController.sendTourUserIds,
    reviewController.createReview
  )
;

reviewRouter.route('/:id')
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview)
  .get(reviewController.getReview);

module.exports = reviewRouter;