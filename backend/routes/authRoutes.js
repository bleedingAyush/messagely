const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  changeUsername,
  signUp,
  authenticate,
  signIn,
  imagekitAuth,
  updateProfilePic,
} = require("../controllers/authControllers");

router.route("/api/changeusername").post(protect, changeUsername);
router.route("/api/signup").post(signUp);
router.route("/api/authenticate").get(protect, authenticate);
router.route("/api/signin").post(signIn);
router.get("/api/imagekit/auth", imagekitAuth);
router.route("/api/user/profilepic").post(protect, updateProfilePic);

module.exports = router;
