const messageModel = require("../../module/message.module");

const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await messageModel.findById(messageId);

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        // Only the sender can delete the message
        if (
            String(message.sender) !==
            String(req.user._id)
        ) {
            return res.status(403).json({
                message: "You can only delete your own message"
            });
        }

        await messageModel.findByIdAndDelete(messageId);

        const io = req.app.get("io");

        // Tell both users that this message was deleted
        io.to(String(message.sender)).emit(
            "messageDeleted",
            {
                messageId: String(messageId)
            }
        );

        io.to(String(message.receiver)).emit(
            "messageDeleted",
            {
                messageId: String(messageId)
            }
        );

        res.status(200).json({
            message: "Message deleted successfully",
            messageId: String(messageId)
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to delete message"
        });
    }
};

module.exports = deleteMessage;