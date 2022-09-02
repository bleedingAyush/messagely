const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");

router.route("/api/message").post(protect, sendMessage);
router.route("/api/message/:chatId").get(protect, allMessages);
module.exports = router;
