const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.route('/')
  .get(reviewController.getReviews)
  .post(reviewController.createReview);

router.route('/:id')
  .get(reviewController.getReviewById)
  .put(reviewController.updateReview)
  .delete(reviewController.deleteReview);

router.patch('/:id/findings/:findingId', reviewController.updateFinding);

module.exports = router;
