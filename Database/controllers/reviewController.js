const Review = require('../models/reviewModel');
const Movie = require('../models/moviesModel');

// 🔘 Create a Review
exports.createReview = async (req, res) => {
  try {
    const { content, rating } = req.body;
    const movieTitle = decodeURIComponent(req.params.movieTitle);

    if (!content || rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).send({ error: 'Content and valid rating (0–5) are required' });
    }

    const movie = await Movie.findOne({ title: movieTitle });
    if (!movie) {
      return res.status(404).send({ error: 'Movie not found' });
    }

    const review = new Review({
      movieId: movie._id,
      userId: req.user,
      content,
      rating,
    });

    const savedReview = await review.save();
    res.status(201).send({ message: 'Review created successfully', review: savedReview });
  } catch (error) {
    console.error('Create review error:', error.message);
    res.status(400).send({ error: 'Failed to create review' });
  }
};

// 🔘 Get All Reviews for a Movie
exports.getReviewsByMovie = async (req, res) => {
  try {
    const movieTitle = decodeURIComponent(req.params.movieTitle);
    const movie = await Movie.findOne({ title: movieTitle });

    if (!movie) {
      return res.status(404).send({ error: 'Movie not found' });
    }

    const reviews = await Review.find({ movieId: movie._id }).populate('userId', 'username');
    res.status(200).send({ reviews });
  } catch (error) {
    console.error('Fetch reviews error:', error.message);
    res.status(500).send({ error: 'Failed to fetch reviews' });
  }
};

// 🔘 Update Review by User
exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { content, rating } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).send({ error: 'Review not found' });
    }

    if (review.userId.toString() !== req.user) {
      return res.status(403).send({ error: 'You can only edit your own reviews' });
    }

    review.content = content || review.content;
    review.rating = rating ?? review.rating;

    const updatedReview = await review.save();
    res.status(200).send({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    console.error('Update review error:', error.message);
    res.status(400).send({ error: 'Failed to update review' });
  }
};

// 🔘 Delete Review by User
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).send({ error: 'Review not found' });
    }

    if (review.userId.toString() !== req.user) {
      return res.status(403).send({ error: 'You can only delete your own reviews' });
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).send({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error.message);
    res.status(400).send({ error: 'Failed to delete review' });
  }
};
