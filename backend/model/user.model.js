const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 13,
      trim: true,
    },
    password: { type: String, required: true, trim: true, select: false },
    profilePic: {
      type: String,
      required: true,
      default: "https://api.multiavatar.com/f91129cf538d4ffb68.png",
    },
  },
  { collection: "users" }
);

const authModel = mongoose.model("user", authSchema);
module.exports = authModel;
