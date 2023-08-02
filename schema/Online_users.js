const mongoose = require('mongoose')
const { Schema } = mongoose

const Online_users = new mongoose.Schema({
    socket:
    {
        type: String,
        required: true
    },
    user:
    {
        type: String,
        required: true
    },
    is_online: {
        type: Boolean,
        required: true
    },
    last_seen: {
        type: String,
        
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Online Users', Online_users)