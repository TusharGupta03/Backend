const express = require('express')
const { otpgenerator, login, token_verification, logout, gets } = require('../controller/auth')
const router = express.Router()

router.post('/otpgenerator', otpgenerator)
router.post('/login', login)
router.get('/token', token_verification)
router.get('/logout', logout)
// router.get('/login/:id', gets)

module.exports = router