const express = require("express");
const multer = require("multer");

const getUsers = require("../contoller/user/getUsers.controller");  
const updateProfile = require("../contoller/user/updateProfile.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();


const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


router.get("/",authMiddleware,getUsers);

router.patch("/profile",authMiddleware,upload.single("profilePicture"),updateProfile);


module.exports = router;