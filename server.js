const express = require('express')
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose')
const cors = require("cors");
const bodyParser = require("body-parser");

const socketio = require('socket.io');

require('dotenv').config()




const app = express()





app.use(cors({ credentials: true, origin: 'https://master--grand-wisp-10972e.netlify.app' }))
app.use(bodyParser.json({ limit: 90000000 }));
app.use(express.json())
app.use(cookieParser())





app.use('/dating/auth', require('./routes/auth.js'))
app.use('/dating/user', require('./routes/user.js'))
app.use('/dating/matches', require('./routes/match.js'))







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

const io = socketio(server)

io.on('connection', (socket) => {
    console.log(`New connection ${socket.id}`)

    socket.on('new_noti', (data) => {
        console.log(`New notification from ${socket.id}`);
        io.emit("new_notification", "send")
    })
})

