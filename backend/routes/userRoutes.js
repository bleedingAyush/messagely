const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const authSchema = require("../model/user.model");

router.route("/api/users").get(protect, async (req, res) => {
  const allUsers = await authSchema.find();
  res.send(allUsers);
});

module.exports = router;
