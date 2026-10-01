const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null
        },

        message: {
            type: String,
            trim: true,
            default: ""
        },

        messageType: {
            type: String,
            enum: [
                "text",
                "image",
                "file"
            ],
            default: "text"
        },

        fileUrl: {
            type: String,
            default: null
        },

        fileName: {
            type: String,
            default: null
        },

        fileType: {
            type: String,
            default: null
        },

        seen: {
            type: Boolean,
            default: false
        },
        deletedFor: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
],
    },
    {
        timestamps: true
    }
);

const messageModel = mongoose.model("Message",messageSchema);

module.exports = messageModel;