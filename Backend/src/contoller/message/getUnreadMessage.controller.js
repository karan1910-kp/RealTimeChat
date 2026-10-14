const messageModel = require("../../module/message.module");

const getUnreadMessages = async (req, res) => {
    try {

        const unreadMessages = await messageModel.aggregate([
            {
                $match: {
                    receiver: req.user._id,
                    seen: false
                }
            },
            {
                $group: {
                    _id: "$sender",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);

        res.status(200).json({
            unreadMessages
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to get unread messages"
        });
    }
};

module.exports = getUnreadMessages;