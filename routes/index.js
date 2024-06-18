const express = require('express');
const router = express.Router();
const passport = require('passport');

//These are all the controller files that contains the main logic of every function.
const landingPageController = require('../controllers/landing_page_controller');
const homePageController = require('../controllers/home_page_controller');


console.log('Router Loaded');


//Homepage controllers (the main page that appears after login) -- 
router.get('/homepage', homePageController.homepage);
router.get('/admin-page', homePageController.adminPageRender);
router.get('/employee-page', homePageController.employeePageRender);
router.post('/log-out', homePageController.destroySession);
router.post('/create-employee-from-admin', homePageController.createEmployeeFromAdmin);

//Below router will be used for the functionality of creating and logging in an employee.
router.get('/create-employee', landingPageController.landing);
router.get('/', landingPageController.landing);
router.post('/create-employee', landingPageController.createEmployee);
router.get('/login-employee', landingPageController.loginEmployeePage);
router.post('/login-employee', passport.authenticate('local', {
    failureRedirect: '/login-employee',
    successRedirect: '/homepage'
}));



module.exports = router;