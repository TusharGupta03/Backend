const mongoose = require('mongoose')
const { Schema } = mongoose

const Expired_Token = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("expired_token", Expired_Token)
