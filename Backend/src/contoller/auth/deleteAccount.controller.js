const bcrypt = require("bcrypt");
const User = require("../../module/user.module");
const messageModel = require("../../module/message.module");

const deleteAccount = async (req, res) => {

    try {

        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Verify password
        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        // Delete user's messages
        await messageModel.deleteMany({
            $or: [
                {
                    sender: user._id
                },
                {
                    receiver: user._id
                }
            ]
        });

        // Delete user account
        await User.findByIdAndDelete(user._id);

        res.status(200).json({
            message: "Account deleted successfully"
        });

    } catch (error) {

        console.log(
            "Delete Account Error:",
            error.message
        );

        res.status(500).json({
            message: "Unable to delete account"
        });
    }
};

module.exports = deleteAccount;