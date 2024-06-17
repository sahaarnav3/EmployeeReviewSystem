

module.exports.homepage = (req, res) => {
    if(!req.isAuthenticated())
        red.redirect('/login-employee');
    res.send("Welcome home");
}