const authRouter = require('express').Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimiterMiddleware');

authRouter.post('/signup', authLimiter, authController.signup);

authRouter.post('/login', authLimiter, authController.login);

module.exports = authRouter;