const messageModel = require("../../module/message.module");

const sendMessage = async (req, res) => {
    try {

        const { receiver, message } = req.body;

        if (!receiver || !message) {
            return res.status(400).json({
                message: "Receiver and message are required"
            });
        }

        const newMessage = await messageModel.create({
            sender: req.user._id,
            receiver: receiver,
            message: message
        });

        res.status(201).json({
            message: "Message sent successfully",
            data: newMessage
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to send message"
        });
    }
};

module.exports = sendMessage;