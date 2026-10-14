const messageModel = require("../../module/message.module");

const markAsSeen = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await messageModel.updateMany(
                {
                    sender: userId,
                    receiver: req.user._id,
                    seen: false
                },
                {
                    $set: {
                        seen: true
                    }
                }
            );

        const io = req.app.get("io");

        io.to(String(userId)).emit("messagesSeen", {
            userId: String(req.user._id)
        });

        res.status(200).json({
            message: "Messages marked as seen"
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to mark messages as seen"
        });
    }
};

module.exports = markAsSeen;