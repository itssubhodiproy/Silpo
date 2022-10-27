const express = require('express')
const route = express.Router()
const { checkNotAuthenticated } = require('../roleAuth')
const ROLE = require('../roles')
const Users = require('../model/users')
const bcrypt = require('bcrypt')
const passport = require('passport')


route.get('/', checkNotAuthenticated, (req, res) => {
    res.render('auth/login')
})

route.post('/', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: `/role`,
    failureRedirect: '/login',
    failureFlash: true
}))


module.exports = route