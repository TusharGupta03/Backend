const Liked_profile = require("../schema/Liked_profile");
const Matched_profile = require("../schema/Matched_profile");
const Seened_profile = require("../schema/Seened_profile")
const User = require("../schema/User")
const mongoose = require('mongoose');

const matched_profile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        const intrest = user.intrest
        let gender = null
        if (user.gender === "Male") {
            gender = "Female"
        }
        else {
            gender = "Male"
        }

        const seened = await Seened_profile.find({ user_id: req.user.id })
        let ids = null
        if (seened.length !== 0) {

            ids = seened[0]._ids

        }



        const matched_profile = await User.find({ intrest: { $in:   intrest }, _id: { $ne: user._id }, gender: gender, _id: { $nin: ids } })
        res.json({ sucess: true, matched_profile: matched_profile, user_intrest: intrest })

    } catch (error) {
        next(error)
    }


}
const matched_chat_profile = async (req, res, next) => {
    try {
        const user = await Matched_profile.find({ user_id: req.user.id })
        let ids = null
        if (user.length!==0) {
            ids = user[0]._ids
        }
        const profiles = await User.find({ _id: { $in: ids } }, '_id name dob photo')

        res.json({ sucess: true, matched_chat_profile: profiles })

    } catch (error) {
        next(error)
    }


}


const seen = async (req, res, next) => {
    try {
        const find = await Seened_profile.findOne({ user_id: req.user.id })
        if (find) {
            const update = await Seened_profile.updateOne({ user_id: req.user.id }, { $push: { _ids: req.body.id } })
            res.json({ sucess: true })

        }
        else {

            const add = new Seened_profile({ user_id: req.user.id, _ids: req.body.id })
            const save = await add.save()
            res.json({ sucess: true })

        }
    } catch (error) {
        next(error)

    }



}

const like = async (req, res, next) => {
    try {
        const find = await Liked_profile.findOne({ user_id: req.user.id })
        if (find) {
            const update = await Liked_profile.updateOne({ user_id: req.user.id }, { $push: { _ids: req.body.id } })


        }
        else {

            const add = new Liked_profile({ user_id: req.user.id, _ids: req.body.id })
            const save = await add.save()

        }

        const liked_profile_likes = await Liked_profile.findOne({ user_id: req.body.id })
        if (liked_profile_likes) {
            const likes = liked_profile_likes._ids
            const result = likes.includes(req.user.id)
            if (result) {
                const user = await User.findById(req.user.id)

                try {
                    const update = await Matched_profile.findOneAndUpdate({ user_id: req.user.id }, { $push: { _ids: req.body.id } }, { new: true, upsert: true })
                    const update2 = await Matched_profile.findOneAndUpdate({ user_id: req.body.id }, { $push: { _ids: req.user.id } }, { new: true, upsert: true })



                } catch (error) {
                    next(error)
                }

                res.json({ sucess: true, code: "matched", user: user })

            }
            else {
                res.json({ sucess: true, code: "not matched" })

            }
        }
        else {
            res.json({ sucess: true, code: "not matched" })


        }


    } catch (error) {
        next(error)

    }
}
const like_profile = async (req, res, next) => {

    try {
        const find = await Liked_profile.findOne({ user_id: req.user.id })
        let ids = null
        if (find) {
            ids = find._ids
        }

        const profiles = await User.find({ _id: { $in: ids } }, '_id name dob photo')
        res.json({ sucess: true, all_user: profiles })

    } catch (error) {
        next(error)

    }


}


module.exports = { matched_profile, seen, like, like_profile, matched_chat_profile }