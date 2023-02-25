const express = require('express');
const reviewController = require('../controllers/reviewsController');
const authController = require('../controllers/authController');

reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authController.protectRoutes);

reviewRouter.route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.sendTourUserIds,
    reviewController.createReview
  )
;

reviewRouter.route('/:id')
  .delete(authController.restrictTo('admin', 'user'), reviewController.deleteReview)
  .patch(authController.restrictTo('user', 'user'), reviewController.updateReview)
  .get(reviewController.getReview);

module.exports = reviewRouter;