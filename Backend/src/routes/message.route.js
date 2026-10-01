const express = require("express");
const router = express.Router();
const multer = require("multer");

const authMiddleware = require("../middleware/auth.middleware");
const sendMessage = require("../contoller/message/sendMessages.controller");
const getMessages = require("../contoller/message/getMessages.controller");
const markAsSeen = require("../contoller/message/markAsSeen.controller");
const getUnreadMessages = require("../contoller/message/getUnreadMessage.controller");
const getConversations = require("../contoller/message/getConversations.controller");
const uploadFile = require("../contoller/message/uploadFile.controller");
const deleteMessage = require("../contoller/message/deleteMessage.controller");
const clearChat = require("../contoller/message/clearChat.controller");

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

router.post("/upload",authMiddleware,upload.single("file"),uploadFile);
router.post("/", authMiddleware, sendMessage);
router.get("/unread",authMiddleware,getUnreadMessages);
router.get("/conversations",authMiddleware,getConversations);
router.delete("/clear/:userId",authMiddleware,clearChat);
router.delete("/:messageId",authMiddleware,deleteMessage);
router.get("/:userId", authMiddleware, getMessages);
router.patch("/:userId/seen", authMiddleware, markAsSeen);


module.exports = router;