const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

usersRouter = express.Router();

usersRouter.get('/me', authController.protectRoutes, usersController.getMe, usersController.getUser);
usersRouter.post('/signup', authController.signup);
usersRouter.post('/login', authController.login);
usersRouter.post('/forgotPassword', authController.forgotPassword);
usersRouter.patch('/resetPassword/:token', authController.resetPassword);
usersRouter.patch('/updateMyPassword', authController.protectRoutes, authController.updatePassword);
usersRouter.patch('/updateMyData', authController.protectRoutes, usersController.updateMyData);
usersRouter.delete('/deleteMe', authController.protectRoutes, usersController.setUserInactive);

usersRouter
  .route('/')
  .get(usersController.getAllUsers);
// .post(usersController.createUser)
//.patch(usersController.patchUser);

usersRouter
  .route('/:id')
  .delete(usersController.deleteUser)
  .patch(usersController.updateUser)
  .get(usersController.getUser);


module.exports = usersRouter;
