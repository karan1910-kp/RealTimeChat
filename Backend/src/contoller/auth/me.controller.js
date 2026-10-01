const User = require("../../module/user.module");

const getMe = async (req, res) => {
    try {

        const user = await User
            .findById(req.user._id)
            .select(
                "_id name email profilePicture"
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {

        console.log(
            "Get Me Error:",
            error.message
        );

        res.status(500).json({
            message: "Unable to get user"
        });
    }
};

module.exports = getMe;