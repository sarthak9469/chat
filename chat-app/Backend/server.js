const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const moment = require('moment');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');

const User = require('./models/user');
const Chat = require('./models/chat');
const Message = require('./models/message');
const db = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],       
    },
});

app.use(cors());
app.use(express.json());
app.use('/', chatRoutes);

//Socket io
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join-chat', (username) => {
        socket.username = username;
        io.emit('message', `${username} joined the chat`);
    });

    socket.on('user-message', async (messageData) => {
        const { chatId, sender, message } = messageData;
        const timestamp = moment().format('h:mm a');

        try {
            const chat = await Chat.findByPk(chatId);

            if (!chat) {
                return socket.emit('message', 'Chat not found');
            }

            const newMessage = await Message.create({
                chat_id: chatId,
                sender,
                message,
                timestamp, // Store timestamp for display
            });

            io.emit('message', `${sender} (${timestamp}): ${message}`);
        } catch (error) {
            socket.emit('message', 'Error sending message');
        }
    });

    socket.on('typing', (isTyping) => {
        socket.broadcast.emit('typing', { username: socket.username, isTyping });
    });

    socket.on('file-upload', (file) => {
        io.emit('file', file);
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('message', `${socket.username} left the chat`);
        }
        console.log('A user disconnected');
    });
});

db.sync({ alter: true });

server.listen(2000, () => {
    console.log('Server is running at port:2000')
});