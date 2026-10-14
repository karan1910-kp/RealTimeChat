const User = require("../../module/user.module");
const imagekit = require("../../config/imagekit");

const updateProfile = async (req, res) => {
    try {

        // ===============================
        // Get Name and Email
        // ===============================

        const { name, email } = req.body;


        // ===============================
        // Validate Name
        // ===============================

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required"
            });
        }


        // ===============================
        // Validate Email
        // ===============================

        if (!email || !email.trim()) {
            return res.status(400).json({
                message: "Email is required"
            });
        }


        // ===============================
        // Check Duplicate Email
        // ===============================

        const existingUser = await User.findOne({
            email: email.trim(),
            _id: {
                $ne: req.user._id
            }
        });


        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }


        // ===============================
        // Prepare Update Data
        // ===============================

        const updateData = {
            name: name.trim(),
            email: email.trim()
        };


        // ===============================
        // Profile Picture Upload
        // ===============================

        if (req.file) {

            // Check whether selected file is an image

            if (!req.file.mimetype.startsWith("image/")) {
                return res.status(400).json({
                    message: "Only image files are allowed"
                });
            }


            // Upload image to ImageKit

            const result = await imagekit.upload({
                file: req.file.buffer,

                fileName: req.file.originalname,

                folder: "/realtime-chat/profile"
            });


            // Save ImageKit URL

            updateData.profilePicture = result.url;
        }


        // ===============================
        // Update User
        // ===============================

        const updatedUser =
            await User.findByIdAndUpdate(
                req.user._id,

                updateData,

                {
                    new: true,
                    runValidators: true
                }
            ).select(
                "_id name email profilePicture"
            );


        // ===============================
        // User Not Found
        // ===============================

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // ===============================
        // Success Response
        // ===============================

        res.status(200).json({
            message: "Profile updated successfully",

            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to update profile"
        });
    }
};


module.exports = updateProfile;