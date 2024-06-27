const express = require('express');
const router = express.Router();
const passport = require('passport');

//These are all the controller files that contains the main logic of every function.
const landingPageController = require('../controllers/landing_page_controller');
const homePageController = require('../controllers/home_page_controller');


console.log('Router Loaded');


//Below Routers Are For Homepage controllers (the main page that appears after login) -- 
//Below router will render employee page or admin page based on the login details.
router.get('/homepage', homePageController.homepage);

//Will open the admin pannel page.
router.get('/admin-page', homePageController.adminPageRender);

// Will Open the employee pannel page.
router.get('/employee-page', homePageController.employeePageRender);

router.post('/log-out', homePageController.destroySession);
// Below Router will be used to create employee in the admin page
router.post('/create-employee-from-admin', homePageController.createEmployeeFromAdmin);

//Below Router will be used to fetch all employees in the admin page.
router.get('/fetch-employees', homePageController.fetchEmployess);

//Below Router will be used to delete employees on request in the admin page.
router.post('/delete-employee', homePageController.deleteEmployee);

// Below Router will be used to edit the details of an employee
router.post('/edit-employee', homePageController.editEmployee);

// Below Router will be used to assign review to and from an Employee
router.post('/add-review', homePageController.addReview);

// Below Router is used to fetch all the ratings for a particular employee.
router.post('/fetch-ratings', homePageController.fetchRatings);

// Below router is used in employee dashboard page to fetch all pending ratings assigned to that particular employee.
router.post('/fetch-pending-ratings', homePageController.fetchPendingRatings);

// Below router is used to modify the rating. Basically change the status from pending to complete with some content.
router.post('/modify-rating', homePageController.modifyRating);

// -----------------------------------------------------------------------------------------------------------------------

//Below router will be used for the functionality of creating and logging in an employee.
//Below Routers will be used to render the create employee page.
router.get('/create-employee', landingPageController.landing);
router.get('/', landingPageController.landing);

// Below Router will create a new Employee Or Admin. (Admin if right keyword is passed).
router.post('/create-employee', landingPageController.createEmployee);

// Below Router will help to login and open either Admin or Employee page.
router.get('/login-employee', landingPageController.loginEmployeePage);

// Passport Login.
router.post('/login-employee', passport.authenticate('local', {
    failureRedirect: '/login-employee',
    successRedirect: '/homepage'
}));

module.exports = router;