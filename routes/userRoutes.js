const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

usersRouter = express.Router();

usersRouter.post('/signup', authController.signup);
usersRouter.post('/login', authController.login);
usersRouter.post('/forgotPassword', authController.forgotPassword);
usersRouter.patch('/resetPassword/:token', authController.resetPassword);
usersRouter.patch('/updateMyPassword', authController.protectRoutes, authController.updatePassword);

usersRouter
  .route('/')
  .get(usersController.getAllUsers);
// .post(usersController.createUser)
//.patch(usersController.patchUser);

usersRouter
  .route('/:id');
//.get(usersController.getUser)
//.delete(usersController.deleteUser);

module.exports = usersRouter;
