const Employee = require('../models/employees');
const Rating = require('../models/ratings');

module.exports.homepage = (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login-employee');
    // res.send(req.user.role);
    if (req.user.role === 'Admin')
        return res.redirect('/admin-page');
    return res.redirect('/employee-page');
    //do one thing just check if employee is admin or not and redirect him accordingly. Don't use this function to render one page.
}

module.exports.fetchEmployess = async (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login-employee');
    let allEmployees = await Employee.find({});
    let onlyEmployees = [];
    allEmployees.forEach(emp => {
        if (emp.role === 'Employee')
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
            email: req.body.email.toLowerCase(),
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
    res.render('employee-page.ejs', {
        backgroundImage: '../images/background2.png', 
        username: req.user.name.toUpperCase(),
        userId: req.user['_id']
    });
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

module.exports.deleteEmployee = async (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login-employee');
    try {
        await Employee.deleteOne({ _id: req.body['employee-id'] });
        await Rating.deleteMany({ to: req.body['employee-id'] });
    } catch (err) {
        console.log("Error While deleting Habit: ", err);
    }
    return res.redirect('/homepage');
}

module.exports.editEmployee = async (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login-employee');
    try {
        if (req.body.role && req.body['edit-needed']) {
            const roleValue = req.body.role;
            const editValue = req.body['edit-needed'];
            await Employee.findByIdAndUpdate(
                req.body['employee-id'],
                { $set: { [roleValue]: editValue } }
            );
            
        } else {
            res.redirect('/homepage');
        }
    } catch (err) {
        if(err.code == 11000){
            console.log("Email Already Exists, try another email.");
            return res.redirect('/homepage');
        }
        console.log("Error Updating Employee Data --", err);
    }
    res.redirect('/homepage');
    // res.json(req.body);
}

module.exports.addReview = async (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login-employee');
    let newRating = "";
    try {
        newRating = await Rating.create(new Rating({
            from: req.body['assign-review-from'],
            to: req.body['assign-review-to'],
            status: 'pending',
            content: ''
        }));
        // console.log(newRating);
    } catch (err) {
        console.log("This error occured in creating the review by admin :- ", err);
    }
    return res.redirect('/homepage');
}

module.exports.fetchRatings = async (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login-employee');
    let finalRating = {};
    try {
        let nameData = [];
        let fetchedRatings = await Rating.find({ to: req.body.employeeId, status: 'complete' });
        // console.log("backend fetched ratings = ", fetchedRatings);
        if(fetchedRatings){
            const promises = fetchedRatings.map(async (rating) => {
                const employee = await Employee.findById(rating.from, {name : 1, _id : 0});
                return employee.name;
            });
            await Promise.all(promises)
            .then((fetchNames) => {
                nameData.push(...fetchNames);
            })
            .catch((err) => {
                console.error("Error fetching names:", error);
            });
            // console.log("finalRating data ----- ",nameData);
            let i = 0;
            fetchedRatings.forEach(rating => {
                finalRating[nameData[i++]] = rating.content;
            });
        }
        
    } catch(err) {
        console.log("Error while fetching ratings from the mongoDB (backend side)--", err);
    }
    return res.json(finalRating);
}

module.exports.fetchPendingRatings = async (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login-employee');
    let finalRating = {};
    try {
        let nameData = [];
        let fetchedRatings = await Rating.find({ from: req.body.employeeId, status: 'pending' });
        if(fetchedRatings){
            const promises = fetchedRatings.map(async (rating) => {
                const employee = await Employee.findById(rating.to, {name : 1, _id : 0});
                return employee.name;
            });
            await Promise.all(promises)
            .then((fetchNames) => {
                nameData.push(...fetchNames);
            })
            .catch((err) => {
                console.error("Error fetching names:", error);
            });
            // console.log("finalRating data ----- ",nameData);
            let i = 0;
            fetchedRatings.forEach(rating => {
                finalRating[nameData[i++]] = rating.id;
            });
        }
        
    } catch(err) {
        console.log("Error while fetching ratings from the mongoDB (backend side)--", err);
    }
    return res.json(finalRating);
}

module.exports.modifyRating = async (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login-employee');
    let ratingContent = req.body['rating-content'].trim();
    let ratingId = req.body['rating-id'];
    try {
        if(ratingContent){
            const update = {
                $set: {
                    status: "complete",
                    content: ratingContent
                }
            };
            const updatedRating = await Rating.findByIdAndUpdate(ratingId, update);
            // if (updatedRating) 
            //     return res.status(200).send({ message: 'Rating updated successfully' });
            // else 
            //     return res.status(404).send({ message: 'Rating not found' });
        }
    } catch(err) {
        console.error(error);
        return res.status(500).send({ message: 'Internal server error' });
    }
    return res.redirect('/homepage');
}