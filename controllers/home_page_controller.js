const Employee = require('../models/employees');

module.exports.homepage = (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login-employee');
    // res.send(req.user.role);
    if (req.user.role === 'Admin')
        return res.redirect('/admin-page');
    return res.redirect('employee-page');
    //do one thing just check if employee is admin or not and redirect him accordingly. Don't use this function to render one page.
}

module.exports.fetchEmployess = async (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login-employee');
    let allEmployees = await Employee.find({});
    let onlyEmployees = [];
    allEmployees.forEach(emp => {
        if(emp.role === 'Employee')
            onlyEmployees.push(emp);
    });
    // console.log("only Employees -- ",onlyEmployees);
    res.json(onlyEmployees);
}

module.exports.adminPageRender = async (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login-employee');
    let allEmployees = '';
    try {
        allEmployees = await Employee.find({});
        // console.log(allEmployees);
    } catch (err) {
        console.log('Error in fetching all the employees data :- ', err);
    }
    res.render('admin-page.ejs', {
        backgroundImage: '../images/background2.png', username: req.user.name.toUpperCase(),
        allEmployessData: allEmployees
    });
}

module.exports.createEmployeeFromAdmin = async (req, res) => {
    let newEmployee = "";
    try {
        newEmployee = await Employee.create(new Employee({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }));
    } catch (err) {
        console.log("This error occured in creating the user :- ", err);
        if (err.code == 11000)
            return res.json({ 'Error': 'This User Already Exists. Try Again With Another Email' });
    }
    return res.redirect('/homepage');
}


module.exports.employeePageRender = (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login-employee');
    res.send("hello bc");
}

module.exports.destroySession = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error Logging Out.");
        }
        res.redirect('/login-employee');
    })
}