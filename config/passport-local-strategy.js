const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Employee = require('../models/employees');

passport.use(new localStrategy({
    usernameField: 'email',
},
    async (email, password, done) => {
        try {
            const employeeData = await Employee.findOne({ email: email });
            if (!employeeData) {
                console.log("Error in finding the Employee --> Passport");
                return done(null, false, { message: "No Employee found with this email, please try again." });
            } else if (employeeData.password != password) {
                console.log("Entered Wrong Password");
                return done(null, false, { message: "Entered Wrong Password, please try again with correct one." });
            }
            return done(null, employeeData);
        } catch (err) {
            console.log("This error occured in passport while logging-in -- ", err);
            return done(null, false, {message: "Some unknown error occured. Please try again"});
        }
    }
));

//Below Functions are basially used to convert the employee object received into a kind of data which can be easily stored in our 
//session storage. This data is unique identifier for the employee.
passport.serializeUser((employee, done) => {
    // console.log(`Serialize Employee Data -- user= ${user}`);
    done(null, employee.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        const employeeData = await Employee.findById(id);
        return done(null, employeeData);
    } catch(err) {
        return (null, false, {message: "Error In Finding The Employee --> Passport"});
    }
});

//Now below function will be used to check even before the landing page loads if any employee is already logged in or not --
// --according to the session cookie, so as to redirect the user to appropriate page.
passport.checkAuthentication = (req, res, next) => {
    if(req.isAuthenticated())
        return next();
    return res.redirect('/');
}

passport.setAuthenticatedUser = (req, res, next) => {
    if(req.isAuthenticated())
        res.locals.user = req.user;
    next();
}

module.exports = passport;