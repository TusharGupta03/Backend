const express = require('express')
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose')
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./schema/User")
const notification = require("./schema/Notification")
const jwt = require("jsonwebtoken");

const socketio = require('socket.io');
const Message = require('./schema/Message');
const Online_users = require('./schema/Online_users');

require('dotenv').config()




const app = express()





app.use(cors({ credentials: true, origin: process.env.front_end_url }))

app.use(bodyParser.json({ limit: 90000000 }));
app.use(express.json())
app.use(cookieParser())





app.use('/dating/auth', require('./routes/auth.js'))
app.use('/dating/user', require('./routes/user.js'))
app.use('/dating/matches', require('./routes/match.js'))
app.use('/dating/chat', require('./routes/chat.js'))







app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errMessage = err.message;
    return res.status(errorStatus).json({
        sucess: false,
        status: errorStatus,
        Message: errMessage
    })
})


Database_url = process.env.Database_url
const connect = async () => {
    try {
        await mongoose.connect(Database_url);
        console.log("Mongo connected Sucessfully");
    }
    catch (error) {
        throw (error)
    }

}

mongoose.connection.on("disconnected", () => {
    console.log("Server goes down")
})
mongoose.connection.on("connected", () => {
    console.log("Server again up")
})



PORT = process.env.PORT
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connect()
})

let online_users = []
const fetching = async () => {

    online_users = await Online_users.find()

    const io = socketio(server, {
        cors: {
            origin: process.env.front_end_url,
            methods: ['GET', 'POST']
        }

    });

    console.log(online_users)
    io.use((socket, next) => {
        const cookies = socket.request.headers.cookie;
        if (cookies) {
            const token = cookies.split(';')
                .find((cookie) => cookie.trim().startsWith('token='))
                .split('=')[1];

            jwt.verify(token, process.env.Secret_Key, (err, decoded) => {
                if (err) {
                    console.log('Invalid token:', err.message);
                    next(new Error('Invalid token'));
                } else {
                    socket.decoded = decoded; // Store decoded information on the socket object for later use
                    next();
                }
            });
        } else {
            console.log('Token cookie not found');
            next(new Error('Token cookie not found'));
        }
    });
    io.on('connection', async (socket) => {





        console.log(`New connection ${socket.id}`)
        console.log(`User id ${socket.decoded.id}`)
        console.log(" ")
        console.log(online_users)


        socket.on("make_user_online", async () => {

            let result =  online_users.findIndex((obj) => obj.socket === socket.decoded.id)
            console.log(`Result is ${result}`)
            if (result !== -1) {

                const update = await Online_users.findOneAndUpdate({ socket: socket.decoded.id }, { user: socket.id, is_online: true }, { new: true })



                online_users[result].user = socket.id;
                online_users[result].is_online = true;

                // update.user = socket.id;
                // update.is_online = true;

            }
            else {

                let date = new Date()
                // let time = `${d.getHours() - 12}.${d.getMinutes()}`

                let hours = date.getHours();
                let minutes = date.getMinutes();
                let ampm = hours >= 12 ? 'pm' : 'am';

                const year = date.getFullYear();
                const month = date.getMonth();
                const day = date.getDate();

                hours = hours % 12;
                hours = hours ? hours : 12;
                minutes = minutes < 10 ? '0' + minutes : minutes;

                let time = `${day}-${month}-${year}  ${hours}.${minutes} ${ampm}`;


                online_users.push({ socket: socket.decoded.id, user: socket.id, is_online: true, last_seen: time })
                const n_u = new Online_users({ socket: socket.decoded.id, user: socket.id, is_online: true, last_seen: time })
                const n_u_save = await n_u.save()
            }

            console.log(online_users)
            console.log("a")
            io.emit("User_is_online", online_users)
        })
        socket.on("online_users", async () => {
            socket.emit("online_users", online_users)

        })
        socket.on('new_noti', async (data) => {


            const user = await User.findById(data)
            const user2 = await User.findById(socket.decoded.id)
            let notifications = await notification.updateOne({ user_id: socket.decoded.id }, { $push: { notification: `There is a notification from${user.name} ` } })
            let notifications2 = await notification.updateOne({ user_id: data }, { $push: { notification: `There is a notification from${user2.name} ` } })
            console.log(notifications)
            console.log(notifications2)
            console.log(`New notification from ${socket.id}`);
            io.emit("new_notification", "send")
        })

        socket.on("new_message", async (data) => {
            console.log(`data is ${data}`)
            data.from = socket.decoded.id
            const message = new Message(data)
            const save_message = await message.save()

            let result = await online_users.find((obj) => obj.socket === data.to)
            console.log(`id is ${data.to}`)
            console.log(` online users are ${online_users}`)

            if (result) {
                if (result.is_online === true) {
                    io.to(result.user).emit("new_message", data)

                }
            }





        })


























        socket.on('disconnect', async () => {
            // const filteredArray = online_users.filter((obj) => obj.socket !== socket.decoded.id);

            // online_users = filteredArray
            let date = new Date()
            // let time = `${d.getHours() - 12}.${d.getMinutes()}`

            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';

            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();

            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;

            let time = `${day}-${month}-${year}  ${hours}.${minutes} ${ampm}`;
            let result = await online_users.findIndex((obj) => obj.socket === socket.decoded.id)
            console.log(result)
            if (result !== -1) {
                online_users[result].is_online = false
                online_users[result].last_seen = time

            }


            const update = await Online_users.findOneAndUpdate({ socket: socket.decoded.id }, { is_online: false, last_seen: time }, { new: true })



            console.log("disconnected users")
            console.log(online_users)

            io.emit("user_disconnected", { online_users: online_users })
        })
        socket.on('logout', async () => {
            // const filteredArray = online_users.filter((obj) => obj.socket !== socket.decoded.id);

            // online_users = filteredArray
            let date = new Date()
            // let time = `${d.getHours() - 12}.${d.getMinutes()}`

            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';

            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();

            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;

            let time = `${day}-${month}-${year}  ${hours}.${minutes} ${ampm}`;

            let result =  online_users.findIndex((obj) => obj.socket === socket.decoded.id)
            console.log(result)
            if (result !== -1) {
                online_users[result].is_online = false
                online_users[result].last_seen = time

            }


            const update = await Online_users.findOneAndUpdate({ socket: socket.decoded.id }, { is_online: false, last_seen: time }, { new: true })

            console.log("disconnected users")
            console.log(online_users)

            io.emit("user_disconnected", { online_users: online_users })
        })









    })


}
fetching()


