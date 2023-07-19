const express = require('express')
const { matched_profile, seen, like, like_profile } = require('../controller/match')
const { token_User_Verify } = require('../Utils/tokenVerification')
const router = express.Router()

router.get('/matched', token_User_Verify, matched_profile)
router.post('/seened', token_User_Verify, seen)
router.post('/liked', token_User_Verify, like)
router.get('/liked', token_User_Verify, like_profile)


module.exports = router