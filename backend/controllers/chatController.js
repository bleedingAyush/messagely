const Chat = require("../model/chat.model");
const User = require("../model/user.model");

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
  var users = req.body.users;
  //   var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users")
      .populate("groupAdmin");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const updateGroupChat = async (req, res, next) => {
  const { chatId, name, users } = req.body;
  if (!chatId || !users) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
  const params = name ? { chatName: name, users } : { users };

  try {
    const updatedChat = await Chat.findOneAndUpdate({ _id: chatId }, params, {
      new: true,
    });
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(400);
    next(new Error(error.message));
    // throw new Error(error.message);
  }
};

const accessChat = async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  // The below query looks for a chat that has both the userId and the other userId in it.
  // If it finds one, then it will try to populate the chat with the users, leaving the password field.
  // after that it will populate the chat with the latest message, if one.

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  // The below query creates a sender object inside latestMessage
  // and then populates it will username pic.
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username pic",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      next(new Error(error));
    }
  }
};

const getAllChats = async (req, res, next) => {
  const { _id } = req.user;
  try {
    let allChats = await Chat.find({
      users: { $elemMatch: { $eq: _id } },
    })
      .populate("users")
      .populate("groupAdmin")
      .populate("latestMessage");

    allChats = await User.populate(allChats, {
      path: "latestMessage.sender",
      select: "username pic",
    });
    res.status(200).json(allChats);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createGroupChat,
  updateGroupChat,
  accessChat,
  getAllChats,
};
