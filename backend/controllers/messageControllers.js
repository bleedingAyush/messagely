const asyncHanlder = require("express-async-handler");
const Message = require("../model/message.model");
const User = require("../model/user.model");
const Chat = require("../model/chat.model");

const allMessages = asyncHanlder(async (req, res) => {
  const { chatId } = req.params;
  const { date } = req.query;
  let messages = [];
  if (date !== "none") {
    const datetime = date ? new Date(date) : null;
    messages = await Message.find({
      chat: chatId,
      createdAt: { $lt: new Date(datetime) },
    })
      .populate(["sender", "chat"])
      .limit(30)
      .sort({ createdAt: -1 });
  } else {
    messages = await Message.find({ chat: chatId })
      .populate(["sender", "chat"])
      .limit(30)
      .sort({ _id: -1 });
  }
  const hasMoreData =
    messages.length > 0 && messages.length >= 30 ? true : false;
  const data = { messages, chatId, date, hasMoreData, userId: req?.user?._id };
  res.status(200).json(data);
});

const sendMessage = asyncHanlder(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate(["sender", "chat"]);
    message = await User.populate(message, {
      path: "chat.users",
      select: "username pic",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
