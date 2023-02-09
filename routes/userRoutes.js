const express = require('express');
const usersController = require('../controllers/usersController');


usersRouter = express.Router();


usersRouter
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser)
  .patch(usersController.patchUser);

usersRouter
  .route('/:id')
  .get(usersController.getUser)
  .delete(usersController.deleteUser);

module.exports = usersRouter;
