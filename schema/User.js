const mongoose = require('mongoose')
const { Schema } = mongoose


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    intrest: {
        type: Array,
        required: true
    },
    photo:
    {
        type: Array,
        required: true,

    },
    isadmin:
    {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("New_User", UserSchema)