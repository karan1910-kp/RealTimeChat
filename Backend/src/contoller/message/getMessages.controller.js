const messageModel = require("../../module/message.module");

const getMessages = async (req, res) => {
    try {
    const currentUserId = req.user._id;
        const selectedUserId = req.params.userId;

        if (!selectedUserId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const messages = await messageModel
    .find({
        $and: [
            {
                $or: [
                    {
                        sender: currentUserId,
                        receiver: selectedUserId
                    },
                    {
                        sender: selectedUserId,
                        receiver: currentUserId
                    }
                ]
            },
            {
                deletedFor: {
                    $ne: currentUserId
                }
            }
        ]
    })
    .populate(
        "replyTo",
        "sender message messageType fileName fileUrl"
    )
    .sort({
        createdAt: 1
    });

        res.status(200).json({
            message: "Messages fetched successfully",
            messages: messages
        });

    } catch (error) {

        console.log("Get Messages Error:", error.message);

        res.status(500).json({
            message: "Unable to fetch messages"
        });
    }
};

module.exports = getMessages