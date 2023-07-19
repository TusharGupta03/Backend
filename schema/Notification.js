const mongoose = require('mongoose')
const { Schema } = mongoose

const NotificationSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    notification: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model("Notifications", NotificationSchema)