const express = require('express');
const { sendMessage, getMessages } = require('../../Controller/user/chatController');

const chatrouter = express.Router();

// ✅ Route to send message
chatrouter.post('/send', sendMessage);

// ✅ Route to get messages between two users
chatrouter.get('/:user1/:user2', getMessages);

module.exports = {chatrouter};
