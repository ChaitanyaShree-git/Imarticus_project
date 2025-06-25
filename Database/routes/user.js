const userRouter = require('express').Router();
const userController = require('../controllers/userController');

userRouter.get('/', userController.getAllUsers);

module.exports = userRouter;