const mongoose = require('mongoose')
const { Schema } = mongoose

const Seened_profile = new mongoose.Schema({
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

module.exports = mongoose.model('Seened_profile', Seened_profile)