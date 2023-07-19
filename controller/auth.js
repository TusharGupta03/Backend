const nodemailer = require('nodemailer');
const err_creation = require('../Utils/ErrorCreation');
const User = require('../schema/User');
const jwt = require("jsonwebtoken");
const Expired_token = require('../schema/Expired_token');
require('dotenv').config()


const otpgenerator = async (req, res, next) => {

    const find = await User.findOne({ email: req.body.email })

    if (find === null) {

        let otp = Math.floor((Math.random() * 1000000) + 1);

        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: 'tg223gupta@gmail.com',
                pass: 'tqqebembudnvoepe'
            }
        });

        var mailOptions = {
            from: 'tg223gupta@gmail.com',
            to: req.body.email,
            subject: '',
            text: `Your Otp is ${otp}`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            let otp = mailOptions.text.split(' ').pop()

            if (error) {
                error = err_creation(404, "Plz Check Your Email Id")
                next(error)
            } else {
                console.log('Email sent: ' + info.response);
                const a = {
                    status: 200,

                    otpis: otp,
                    Sucess: true
                }

                res.status(200).json(a)
            }
        });
    }
    else {
        res.status(200).json({
            status: "203"
        })

    }
}

const login = async (req, res, next) => {
    try {

        const find = await User.findOne({ email: req.body.email })

        if (find !== null) {

            let bufferObj = Buffer.from(find.password, "base64");
            let pass = bufferObj.toString("utf8");
            if (pass === req.body.password) {

                const token = jwt.sign({ id: find._id, isAdmin: find.isadmin }, process.env.Secret_Key, { expiresIn: "1hour" })


                res.cookie("token", token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true, secure: true
                }).status(200).json({
                    status: 200,
                    message: "Login Sucessfully"
                })

            }
            else {

                error = err_creation(404, "Invalid Credentials")
                next(error)
            }
        }
        else {
            error = err_creation(404, "Invalid Credentials2")
            next(error)
        }
    } catch (error) {
        next(error)
    }


}
const token_verification = (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log(token)
        if (token === null) {
            err = err_creation(401, "You haven't Logged in")
            next(err)
        }

        else {

            // const expired_token = Expired_token.find({ token: req.cookies.token })
            // if (expired_token === null) {

            jwt.verify(token, process.env.Secret_Key, async (err, user) => {
                if (err) {
                    err = err_creation(403, err)
                    next(err)
                }
                else {
                    const find = await User.findOne({ _id: user.id })


                    res.status(200).json({
                        name: find.name,
                        photo: find.photo[0],
                        status: 200
                    })
                }
            })

            // }
            // else 
            // {

            // }


        }

    } catch (error) {
        next(error)
    }


}
const logout = async (req, res, next) => {
    try {
        const cookiee = req.cookies.token
        if (cookiee !== null) {
            const new_expired_token = Expired_token({
                token: cookiee
            })
            const save = await new_expired_token.save()
            res.clearCookie("token")
            res.json({
                status: 200
            })
        }
        else {
            res.json({
                status: 200
            })

        }


    } catch (error) {
        next(error)
    }

}


const gets = async (req, res, next) => {
    const find = await User.findOne({ email: req.params.id })

    res.json(find)


}


module.exports = { otpgenerator, login, token_verification, logout, gets }