const bcrypt = require("bcrypt");
const User = require("../../module/user.module");

const verifyPassword = async (req, res) => {

    try {

        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        const user = await User.findById(
            req.user._id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

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

        res.status(200).json({
            message: "Password verified successfully"
        });

    } catch (error) {

        console.log(
            "Verify Password Error:",
            error.message
        );

        res.status(500).json({
            message: "Unable to verify password"
        });
    }
};

module.exports = verifyPassword;