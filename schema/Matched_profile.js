const mongoose = require('mongoose')
const { Schema } = mongoose

const Matched_profile = new mongoose.Schema({
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

module.exports = mongoose.model('Matched_profile', Matched_profile)