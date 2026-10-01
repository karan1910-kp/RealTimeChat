const messageModel = require("../../module/message.module");

const clearChat = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const currentUserId = req.user._id;

        // Mark messages as deleted ONLY
        // for the current user.
        const result = await messageModel.updateMany(
            {
                $or: [
                    {
                        sender: currentUserId,
                        receiver: userId
                    },
                    {
                        sender: userId,
                        receiver: currentUserId
                    }
                ],

                deletedFor: {
                    $ne: currentUserId
                }
            },
            {
                $addToSet: {
                    deletedFor: currentUserId
                }
            }
        );

        const io = req.app.get("io");

        // IMPORTANT:
        // Send event ONLY to the user who cleared chat.
        io.to(String(currentUserId)).emit(
            "chatCleared",
            {
                userId: String(userId)
            }
        );

        res.status(200).json({
            message: "Chat cleared for you",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.log(
            "Clear Chat Error:",
            error.message
        );

        res.status(500).json({
            message: "Unable to clear chat"
        });
    }
};

module.exports = clearChat;