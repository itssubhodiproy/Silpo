const express = require('express')
const app = express()
const mongoose = require('mongoose')
//dotenv
require('dotenv').config()
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
//login libraries
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')
//importing mongoSchema
const Users = require('./model/users')
const Product = require('./model/products')
//importing roles
const ROLE = require('./roles')
//auth each role
const { authRole, checkAuthenticated, checkNotAuthenticated } = require('./roleAuth')
const Order = require('./model/orders')


//mongodb connection
//MongoDB connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
}, () => console.log(`Database is connected to ${MONGO_URI}`))

//initialixing passport
initializePassport(passport)

//middlewares
// app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }))

//login middlewares
app.use(flash())
app.use(session({
    secret: "Secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


//registration and login forms
//for rendering register form
const registerRoute = require('./routes/register')
app.use('/register', registerRoute)

const adminRoute = require('./routes/admin')
app.use('/admin', adminRoute)

const loginRoute = require('./routes/login')
app.use('/login', loginRoute)

const customerRoute = require('./routes/customer')
app.use('/customer', customerRoute)

const driverRoute = require('./routes/driver')
app.use('/driver', driverRoute)

//for rendering login form 

//for logout
app.delete('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});


//routes
app.get('/', checkAuthenticated, (req, res) => {
    const role = req.user.role;
    res.redirect(`/${role}`);
})

//status can only update by driver and admin


app.listen(PORT, () => console.log(`server is listening on port ${PORT}`))
