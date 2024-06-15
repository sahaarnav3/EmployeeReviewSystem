
module.exports.landing = (req, res) => {
    res.render('landing.ejs', { backgroundImage: '../images/background4.jpg' });
}

module.exports.loginEmployeePage = (req, res) => {
    res.render('login-user.ejs', { backgroundImage: '../images/background4.jpg' });
}