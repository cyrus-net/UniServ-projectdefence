const Message = require("../models/Message");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Send a message
async function sendMessage(req, res) {
  try {
    const { receiverId, message } = req.body;

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const newMessage = await Message.create({
      sender: req.userId,
      receiver: receiverId,
      message,
    });

    const sender = await User.findById(req.userId);
    await Notification.create({
      recipient: receiverId,
      type: "message",
      title: "New Message",
      message: `${sender?.fullName || "Someone"} sent you a new message.`,
      read: false,
      metadata: { message: newMessage._id },
    });

    const populatedMessage = await newMessage.populate("sender receiver", "fullName email");
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get messages for the current user
async function getMessages(req, res) {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId },
        { receiver: req.userId },
      ],
    })
      .populate("sender", "fullName email")
      .populate("receiver", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get conversation with a specific user
async function getConversation(req, res) {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId },
      ],
    })
      .populate("sender", "fullName email")
      .populate("receiver", "fullName email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { sendMessage, getMessages, getConversation };
