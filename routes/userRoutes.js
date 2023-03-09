const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');


usersRouter = express.Router();

usersRouter.post('/signup', authController.signup);
usersRouter.post('/login', authController.login);
usersRouter.get('/logout', authController.logout);
usersRouter.post('/forgotPassword', authController.forgotPassword);
usersRouter.patch('/resetPassword/:token', authController.resetPassword);

// protect all routes after this middleware
usersRouter.use(authController.protectRoutes);

usersRouter.get('/me', usersController.getMe, usersController.getUser);
usersRouter.patch('/updateMyPassword', authController.updatePassword);
usersRouter.patch('/updateMyData', usersController.deleteUserPhoto, usersController.uploadUserPhoto, usersController.resizePhoto, usersController.updateMyData);
usersRouter.delete('/deleteMe', usersController.setUserInactive);

usersRouter.use(authController.restrictTo('admin'));

usersRouter
  .route('/')
  .get(usersController.getAllUsers);

usersRouter
  .route('/:id')
  .delete(usersController.deleteUser)
  .patch(usersController.updateUser)
  .get(usersController.getUser);


module.exports = usersRouter;
