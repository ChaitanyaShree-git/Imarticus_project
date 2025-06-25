const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/:movieTitle', authenticate, reviewController.createReview);
router.get('/:movieTitle', reviewController.getReviewsByMovie);
router.patch('/update/:reviewId', authenticate, reviewController.updateReview);
router.delete('/delete/:reviewId', authenticate, reviewController.deleteReview);

module.exports = router;
