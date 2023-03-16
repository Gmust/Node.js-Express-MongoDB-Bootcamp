const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingConroller');

const viewRouter = express.Router();

viewRouter.use(viewController.alerts)

viewRouter.get('/',  authController.isLoggedIn, viewController.getOverview);
viewRouter.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);
viewRouter.get('/login', authController.isLoggedIn, viewController.login);
viewRouter.get('/me', authController.protectRoutes, viewController.getAccount);
viewRouter.get('/my-tours', authController.protectRoutes, viewController.getMyTours);

viewRouter.post('/user-update-info', authController.protectRoutes, viewController.updatesUserData);

module.exports = viewRouter;