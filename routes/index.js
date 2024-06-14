const express = require('express');
const router = express.Router();
const passport = require('passport');

//These are all the controller files that contains the main logic of every function.
const landingPageController = require('../controllers/landing_page_controller');


console.log('Router Loaded');


router.get('/', landingPageController.landing);


module.exports = router;