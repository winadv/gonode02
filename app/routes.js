const express = require('express');

const routes = express.Router();


/**
 * Middlewares
 */
const guestMiddleware = require('./middlewares/guest');
const authMiddleware = require('./middlewares/auth');
/**
 * Controllers
 */
const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const projectController = require('./controllers/projectController');
const sectionController = require('./controllers/sectionController');
/**
 * Flash
 */
routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});
/**
 * Auth
 */
routes.get('/', guestMiddleware, authController.sign);
routes.get('/signup', guestMiddleware, authController.signup);
routes.get('/signout', authMiddleware, authController.signout);

routes.post('/register', authController.register);
routes.post('/authenticate', authController.authenticate);

/**
 * Dashboard
 */
routes.use('/app', authMiddleware);
routes.get('/app/dashboard', dashboardController.index);

/**
 * Projects
 */
routes.get('/app/projects/:id', projectController.show);
routes.post('/app/projects/create', projectController.store);
routes.delete('/app/projects/:id', projectController.destroy);
/**
 * Section
 */
routes.get('/app/projects/:projectId/sections/:id', sectionController.show);
routes.post('/app/projects/:projectId/sections/create', sectionController.store);
routes.put('/app/projects/:projectId/sections/:id', sectionController.update);
routes.delete('/app/projects/:projectId/sections/:id', sectionController.destroy);


routes.use((req, res) => res.render('errors/404'));


routes.use((err, req, res, _next) => {
  res.status(err.status || 500);
  return res.render('errors/index', {
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

module.exports = routes;
