const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: [true, "Email is already registered"]
    },

    password: {
        type: String,
        required: true
    },

    profilePicture: {
        type: String,
        default: null
    },

});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;