const express = require('express');
const router = express.Router();
const passport = require('passport');

//These are all the controller files that contains the main logic of every function.
const landingPageController = require('../controllers/landing_page_controller');


console.log('Router Loaded');

//Below router will be used for the functionality of creating and logging in an employee.
router.get('/', landingPageController.landing);
router.get('/login-employee', landingPageController.loginEmployeePage);


module.exports = router;