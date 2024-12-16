const User = require('../models/user');
const Chat = require('../models/chat');
const Message = require('../models/message');


exports.registerUser = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create the user
    const user = await User.create({ username });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};


// Controller to initiate a chat
exports.initiateChat = async (req, res) => {
  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    return res.status(400).json({ message: 'Both users are required' });
  }

  try {
    const user1Record = await User.findOne({ where: { username: user1 } });
    const user2Record = await User.findOne({ where: { username: user2 } });

    if (!user1Record || !user2Record) {
      return res.status(404).json({ message: 'User not found' });
    }

    const chatId = `${user1Record.username}-${user2Record.username}`;

    const existingChat = await Chat.findOne({ where: { id: chatId } });
    if (existingChat) {
      return res.status(200).json({ chatId, message: 'Chat already exists' });
    }

    const chat = await Chat.create({
      id: chatId,
      user1_id: user1Record.id,
      user2_id: user2Record.id,
    });

    res.status(200).json({ chatId: chat.id, message: 'Chat initiated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating chat', error });
  }
};

// Controller to send a message
exports.sendMessage = async (req, res) => {
  const { chatId, sender, message } = req.body;

  if (!chatId || !sender || !message) {
    return res.status(400).json({ message: 'Chat ID, sender, and message are required' });
  }

  try {
    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const newMessage = await Message.create({
      chat_id: chatId,
      sender,
      message,
    });

    res.status(200).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Controller to get messages from a chat
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findByPk(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const messages = await Message.findAll({
      where: { chat_id: chatId },
      order: [['timestamp', 'ASC']],
    });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};
