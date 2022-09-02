const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var ImageKit = require("imagekit");

async function validatePassword(newPassword, oldPassword) {
  try {
    const isValidPassword = await bcrypt.compare(newPassword, oldPassword);
    return isValidPassword;
  } catch (err) {
    return null;
  }
}

function generateToken(username, _id) {
  const token = jwt.sign({ username, _id }, process.env.JWT_SECRET, {
    expiresIn: "20d",
  });
  return token;
}

// router.route("/api/changeusername").post(protect, async (req, res, next) => {
//   const { username } = req.body;
//   const { _id } = req.user;
//   console.log(req.user._id);
//   const user = await authSchema.findById(_id);
//   user.username = username;
//   await user.save();
//   res.status(200).json({
//     message: "Username changed successfully",
//   });
// });

const changeUsername = async (req, res, next) => {
  const { username } = req.body;
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    user.username = username;
    await user.save();
    res.status(200).json({
      message: "Username changed successfully",
    });
  } catch (error) {
    res.status(400);
    next(new Error(error.message));
  }
};

const signUp = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let data = await User.create({
      username,
      password: hashedPassword,
    });
    const token = generateToken(username, data._id);

    res.status(200).send({ token, data });
  } catch (error) {
    console.log("error", error);
    if (error.code === 11000) {
      next(new Error("Username already exists"));
    } else {
      next(new Error("Something went wrong"));
    }
  }
};

const authenticate = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.status(200).json(user);
  } catch (err) {
    next(new Error(err));
  }
};

const signIn = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const data = await User.findOne({
      username,
    }).select("+password");

    if (!data) {
      res.status(404);
      next(new Error("Invalid username or password"));
      return;
    }

    const isValidPassword = await validatePassword(password, data.password);
    if (!isValidPassword) {
      res.status(401);
      next(new Error("Invalid username or password"));

      return;
    }

    const token = generateToken(username, data._id);
    res.send({ token, user: data });
  } catch (err) {
    next(new Error("Something went wrong"));
  }
};

const imagekitAuth = async (req, res, next) => {
  try {
    var imagekit = new ImageKit({
      publicKey: "public_sbPhCWlrgdFmBFXhIu/i9pr5ELY=",
      privateKey: "private_ScNev6uEiyZEOFDXZ6DMSTuiX+o=",
      urlEndpoint: "https://ik.imagekit.io/z6hnu4m5i",
    });

    var authenticationParameters = imagekit.getAuthenticationParameters();
    res.send({
      token: authenticationParameters.token,
      signature: authenticationParameters.signature,
      expire: authenticationParameters.expire,
    });
  } catch (error) {
    next(new Error(error));
  }
};

const updateProfilePic = async (req, res, next) => {
  const { imageUrl } = req.body;
  // console.log("url", imageUrl);
  const userId = req.user._id;
  const userData = await User.findOneAndUpdate(
    {
      _id: userId,
    },
    { profilePic: imageUrl },
    {
      new: true,
    }
  );

  res.send({ imageUrl, userData });
};

module.exports = {
  changeUsername,
  signUp,
  authenticate,
  signIn,
  imagekitAuth,
  updateProfilePic,
};
