const Message = require("../schema/Message")

const message = async (req, res, next) => {
    try {
        const messages = await Message.find({ $or: [{ from: req.user.id, to: req.body.id }, { from: req.body.id, to: req.user.id }] }).sort({ timestamp: 1 })
        

        res.json({ sucess: true, messages: messages,user:req.user.id })

    } catch (error) {
        next(error)
    }
}
module.exports={message}