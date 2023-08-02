const User = require("../schema/User")
const notification = require("../schema/Notification")
const cloudinary = require('cloudinary').v2;
require('dotenv').config()
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});


const new_user = async (req, res, next) => {
    try {

        let pass = req.body.password
        let bufferObj = Buffer.from(pass, "utf8");
        pass = bufferObj.toString("base64");
        req.body.password = pass

        const images = req.body.photo
        const imageUrls = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i], {
                folder: 'images',
            });
            imageUrls.push(result.secure_url);
        }

        req.body.photo = imageUrls

        const user = new User(req.body);
        const save_user = await user.save()


        const id = await User.find({ email: req.body.email })
        const notifi = new notification({
            user_id: id[0]._id,
            notification: ["Welcome to our dating website"]
        })

        const save = await notifi.save()


        res.status(200).json({ status: 200, message: "Account Created Sucessfully" })
    }


    catch (error) {

        next(error)
    }


}

const dashboard_user = async (req, res, next) => {

    try {
        const all_user = await User.find({ _id: { $ne: req.user.id } }, '_id name dob photo')


        res.status(200).json({ sucess: true, all_user: all_user })

    } catch (error) {
        next(error)
    }

}
let a = 0;

const addNotification = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        let notifications = await notification.updateOne({ user_id: "648c17580ec62c2e2e5b017f" }, { $push: { notification: `There is a notification from${user.name} ` } })
        res.send(notifications)



    } catch (error) {
        next(error)
    }
}

const getNotification = async (req, res, next) => {
    try {
        const notifications = await notification.find({ user_id: req.user.id })
        res.json({
            sucess: true,
            notifications: notifications[0]
        })


    } catch (error) {
        next(error)
    }
}


module.exports = { new_user, dashboard_user, getNotification, addNotification }