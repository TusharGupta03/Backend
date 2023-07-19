const jwt = require("jsonwebtoken");
const err_creation = require("./ErrorCreation");
require('dotenv').config()
const token_User_Verify = (req, res, next) => {
    // res.cookie("a", "test cookie");
    const token = req.cookies.token;
    try {
        if (token === null) {
            next(err_creation("404", "You haven't Logged in"))
        }

        try {
            jwt.verify(token, process.env.Secret_Key, (err, user) => {
                if (err) {
                    next(err_creation("404", "You have token but it is not valid"))
                }
                req.user = user
                next()
            })
        } catch (error) {
            next(error)
        }

    } catch (error) {
        next(error)
    }


}

module.exports={token_User_Verify}