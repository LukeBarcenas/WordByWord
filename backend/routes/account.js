const express = require('express')

const {signupUser, loginUser} = require('../controllers/accountController')

const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signupUser)

module.exports = router