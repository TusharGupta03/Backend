const mongoose = require('mongoose')
const { Schema } = mongoose

const Liked_profile = new mongoose.Schema({
    user_id:
    {

        type: String,
        required: true
    },
    _ids:
    {
        type: Array,
        required: true
    }

})

module.exports = mongoose.model('Liked_profile', Liked_profile)