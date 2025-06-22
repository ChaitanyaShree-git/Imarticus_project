const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    reviews: [reviewSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Movie = mongoose.model("movies", movieSchema);

module.exports = Movie;
