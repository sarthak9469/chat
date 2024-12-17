const User = require('../models/user');
const Chat = require('../models/chat');
const Message = require('../models/message');


exports.registerUser = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = await User.create({ username });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};


exports.initiateChat = async (req, res) => {
  const { user1Id, user2Id } = req.body;

  if (!user1Id || !user2Id) {
    return res.status(400).json({ message: 'Both user IDs are required' });
  }

  try {
    const user1Record = await User.findOne({ where: { id: user1Id } });
    const user2Record = await User.findOne({ where: { id: user2Id } });

    if (!user1Record || !user2Record) {
      return res.status(404).json({ message: 'User not found' });
    }

    const chatId = `${user1Id}-${user2Id}`;

    const existingChat = await Chat.findOne({ where: { id: chatId } });
    if (existingChat) {
      return res.status(200).json({ chatId, message: 'Chat already exists' });
    }

    const chat = await Chat.create({
      id: chatId,
      user1_id: user1Id,
      user2_id: user2Id,
    });

    res.status(200).json({ chatId: chat.id, message: 'Chat initiated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error initiating chat', error });
  }
};



exports.sendMessage = async (req, res) => {
  console.log('Request received at /api/send:', req.body);
  const { chatId, sender, message } = req.body;

  if (!chatId || !sender || !message) {
    console.error('Invalid request:', { chatId, sender, message });
    return res.status(400).json({ message: 'Chat ID, sender, and message are required' });
  }

  try {
    const chat = await Chat.findOne({
      where: { id: chatId },
      include: [{ model: User, as: 'user1' }, 
        { model: User, as: 'user2' }]
    });

    if (!chat) {
      console.log(`Chat not found. Provided chatId: ${chatId}`);
      return res.status(404).json({ message: 'Chat not found' });
    }

    const newMessage = await Message.create({
      chat_id: chatId,
      sender,
      message,
    });
    console.log('Message saved:', newMessage);

    res.status(200).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message', error });
  }
};


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
