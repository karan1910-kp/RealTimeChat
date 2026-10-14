const messageModel = require("../../module/message.module");

const getConversations = async (req, res) => {

    try {

        const conversations =
            await messageModel.aggregate([

                {
                    $match: {
                        $and: [

                            {
                                $or: [
                                    {
                                        sender:
                                            req.user._id
                                    },
                                    {
                                        receiver:
                                            req.user._id
                                    }
                                ]
                            },

                            // Don't show messages
                            // cleared by the current user
                            {
                                deletedFor: {
                                    $ne: req.user._id
                                }
                            }

                        ]
                    }
                },

                {
                    $addFields: {
                        otherUser: {
                            $cond: [
                                {
                                    $eq: [
                                        "$sender",
                                        req.user._id
                                    ]
                                },
                                "$receiver",
                                "$sender"
                            ]
                        }
                    }
                },

                {
                    $sort: {
                        createdAt: -1
                    }
                },

                {
                    $group: {
                        _id: "$otherUser",

                        message: {
                            $first: "$message"
                        },

                        messageType: {
                            $first: "$messageType"
                        },

                        fileName: {
                            $first: "$fileName"
                        },

                        createdAt: {
                            $first: "$createdAt"
                        }
                    }
                },

                {
                    $sort: {
                        createdAt: -1
                    }
                }

            ]);

        res.status(200).json({
            conversations
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to get conversations"
        });
    }

};

module.exports = getConversations;