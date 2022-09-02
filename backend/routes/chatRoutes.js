const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createGroupChat,
  updateGroupChat,
  accessChat,
  getAllChats,
} = require("../controllers/chatController");

router.route("/api/chats/all").get(protect, getAllChats);
router.route("/api/chats/access").post(protect, accessChat);
router.route("/api/chats/group").post(protect, createGroupChat);
router.route("/api/chats/group/update").post(protect, updateGroupChat);

module.exports = router;
