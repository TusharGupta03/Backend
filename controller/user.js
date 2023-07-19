const User = require("../schema/User")
const notification = require("../schema/Notification")


const new_user = async (req, res, next) => {
    try {

        let pass = req.body.password
        let bufferObj = Buffer.from(pass, "utf8");
        pass = bufferObj.toString("base64");
        req.body.password = pass

        const user = new User(req.body);
        const save_user = await user.save()


        const id = await User.find({ email: req.body.email })
        console.log(id)
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
        console.log(notifications)
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