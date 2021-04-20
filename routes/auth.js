const express = require('express')
const router = express.Router()
const {userSignupValidator} = require('../validator/index')


const {signin,signup,signout,requireSignin} = require('../controller/auth')


router.post('/signup', userSignupValidator, signup)

router.post('/signin', signin)

router.get('/signout', signout)


module.exports = router