const imagekit = require("../../config/imagekit");

const uploadFile = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "No file selected"
            });
        }

        const file = req.file;

        const result = await imagekit.upload({
            file: file.buffer,
            fileName: file.originalname,
            folder: "/realtime-chat"
        });

        res.status(200).json({
            message: "File uploaded successfully",

            fileUrl: result.url,

            fileName: file.originalname,

            fileType: file.mimetype
        });

    } catch (error) {

        console.log(
            "File Upload Error:",
            error.message
        );

        res.status(500).json({
            message: "File upload failed"
        });
    }
};

module.exports = uploadFile;