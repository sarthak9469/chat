const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/api/register', chatController.registerUser);
router.post('/api/initiate', chatController.initiateChat);
router.post('/api/send', chatController.sendMessage);
router.get('/api/:chatId/messages', chatController.getMessages);

module.exports = router;
