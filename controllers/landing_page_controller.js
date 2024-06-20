
const Employee = require('../models/employees');

module.exports.landing = (req, res) => {
    if(req.isAuthenticated())
        res.redirect('/homepage');
    res.render('landing.ejs', { backgroundImage: '../images/background4.jpg' });
}

module.exports.loginEmployeePage = (req, res) => {
    if(req.isAuthenticated())
        res.redirect('/homepage');
    res.render('login-user.ejs', { backgroundImage: '../images/background4.jpg' });
}

module.exports.createEmployee = async (req, res) => {
    if(req.isAuthenticated())
        res.redirect('/homepage');
    if (req.body.password !== req.body['confirm-password'])
        return res.json({ "Error": "Please enter correct password in both the fields. Try Again" });
    let newEmployee = "";
    try {
        const role = req.body['secret-code'] == 'ninja' ? 'Admin' : 'Employee';
        newEmployee = await Employee.create(new Employee({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: role
        }));
    } catch (err) {
        console.log("This error occured in creating the user :- ", err);
        if (err.code == 11000)
            return res.json({ 'Error': 'This User Already Exists. Try Again With Another Email' });
        return res.redirect('/');
    }
    console.log("Employee Successfully Created.");
    res.redirect('/login-employee');
}