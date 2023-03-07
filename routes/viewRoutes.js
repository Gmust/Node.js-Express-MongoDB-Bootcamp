const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const viewRouter = express.Router();


viewRouter.get('/', authController.isLoggedIn, viewController.getOverview);
viewRouter.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);
viewRouter.get('/login', authController.isLoggedIn, viewController.login);
viewRouter.get('/me', authController.protectRoutes, viewController.getAccount);

viewRouter.post('/user-update-info', authController.protectRoutes, viewController.updatesUserData);

module.exports = viewRouter;