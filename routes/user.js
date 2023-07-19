const express = require('express')
const { new_user, dashboard_user, getNotification, addNotification } = require('../controller/user')
const { token_User_Verify } = require('../Utils/tokenVerification')
const router = express.Router()

router.post('/new_user', new_user)
router.get('/users', token_User_Verify, dashboard_user)
router.post('/notification', token_User_Verify, addNotification)
router.get('/notification', token_User_Verify, getNotification)

module.exports = router