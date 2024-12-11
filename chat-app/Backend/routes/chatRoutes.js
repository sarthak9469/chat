const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/register', chatController.registerUser);
router.post('/initiate', chatController.initiateChat);
router.post('/send', chatController.sendMessage);
router.get('/:chatId/messages', chatController.getMessages);

module.exports = router;
