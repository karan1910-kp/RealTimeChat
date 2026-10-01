const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: String,

    email: {
        type: String,
        unique: [true, "Email is already registered"]
    },

    password: String,

    profilePicture: {
        type: String,
        default: null
    }

});

const userModel = mongoose.model("users",userSchema);

module.exports = userModel;