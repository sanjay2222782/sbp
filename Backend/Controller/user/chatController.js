const { statuscode, catchcode } = require('../../../statuscode');
const Message = require('../../Model/user/message');
const User = require('../../Model/user/user');
const socketManager = require("../../socket/socketManager");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const { _id } = req.user;
    if (!_id || !receiverId || !message) {
      return res.send({
        message: 'All fields are required!',
        success: false,
        status: statuscode.BAD_REQUEST
      });
    }

    const newMessage = new Message({
      sender: _id,
      receiver: receiverId,
      message
    });

    await newMessage.save();

    // Emit real-time event
    const io = socketManager.io;
    if (io) {
      io.emit("receiveMessage", { sender: _id, receiver: receiverId, message });
    }

    return res.send({ success: true, message: 'Message sent!', status: statuscode.CREATED });

  } catch (error) {
    console.error(error);
    return res.send(catchcode);
  }
};

// ✅ Get Messages Between Two Users
const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 });

    return res.send(messages);

  } catch (error) {
    console.error(error);
    return res.send(catchcode);
  }
};

module.exports = {
  sendMessage,
  getMessages
};
