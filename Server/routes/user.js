const express = require('express')
const router = express.Router()
const {register, login, logout, dummy} = require('../controllers/User')

router
.post('/register', register)
.post('/login', login)
.get('/logout', logout)
.get('/dummy', dummy)  

module.exports = router