const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); // this is used to parse the json data received from script.js of client side. or we can say front end side.
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');

const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static('./assets'));
app.use(expressLayouts);
app.use(session({
    name: 'EmployeeReviewSystem',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1000 * 60 * 60 * 60) //60 hours
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//extract css and javascript files from sub-pages into layout
app.set('layout extractStyles', true);
app.set('layout extractScript', true);

//setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//using express router
app.use('/', require('./routes'));

const listener = app.listen(process.env.PORT || 3000, (err) => {
    if (err)
        console.log(`Error in running the server: ${err}`);
    console.log('Your app is listening on port: ' + listener.address().port);
});