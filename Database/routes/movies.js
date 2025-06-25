const movieRouter = require('express').Router();
const moviesController = require('../controllers/moviesController');
const { authenticate } = require('../middlewares/authMiddleware');

movieRouter.get('/', authenticate, moviesController.getAllmovies);

movieRouter.get('/:id', authenticate, moviesController.getmovieById);

movieRouter.post('/', authenticate, moviesController.createmovie);

movieRouter.patch('/:id', authenticate, moviesController.updatemovie);

movieRouter.delete('/:id', authenticate, moviesController.deletemovie);


module.exports = movieRouter;