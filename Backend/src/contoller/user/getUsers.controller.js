const User = require("../../module/user.module");

const getUsers = async (req, res) => {
    try {

        const users = await User
            .find({
                _id: {
                    $ne: req.user._id
                }
            })
            .select(
                "_id name email profilePicture"
            );

        res.status(200).json({
            users
        });

    } catch (error) {

        console.log(
            "Get Users Error:",
            error.message
        );

        res.status(500).json({
            message: "Unable to get users"
        });
    }
};

module.exports = getUsers;