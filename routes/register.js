const express = require('express')
const route = express.Router()
const { checkNotAuthenticated } = require('../roleAuth')
const Users = require('../model/users')
const bcrypt = require('bcrypt')


route.get('/', checkNotAuthenticated, (req, res) => {
    res.render('auth/register.ejs')
})

route.post('/', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = await Users.findOne({ username: req.body.username })
        if (user) return res.status(400).send("User Already Exists")
        await Users.create({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})


module.exports = route
