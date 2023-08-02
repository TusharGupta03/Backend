const express = require('express')
const { message } = require('../controller/chat')
const { token_User_Verify } = require('../Utils/tokenVerification')
const router = express.Router()


router.post('/mess', token_User_Verify, message)

module.exports = router