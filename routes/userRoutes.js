const express = require('express');
const usersController = require('../controllers/usersController');
const authController = require('../controllers/authController');

usersRouter = express.Router();

usersRouter.post('/signup', authController.signup);
usersRouter.post('/login', authController.login);

usersRouter
  .route('/')
  .get(usersController.getAllUsers)
 // .post(usersController.createUser)
  //.patch(usersController.patchUser);

usersRouter
  .route('/:id')
  //.get(usersController.getUser)
  //.delete(usersController.deleteUser);

module.exports = usersRouter;
