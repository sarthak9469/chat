import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:7000');

const ChatRoom = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join-chat', username);

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('typing', (data) => {
      setTyping(data.isTyping ? `${data.username} is typing...` : '');
    });

    return () => {
      socket.off('message');
      socket.off('typing');
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim()) {
      const chatId = 'user1-user2'; // Replace with dynamic chat ID
      await fetch('http://localhost:7000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          sender: username,
          message,
        }),
      });
      setMessage('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', message !== '');
  };

  return (
    <div id="chat-container">
      <h1>Chat Application</h1>
      <div id="typing-indicator">{typing}</div>
      <div id="messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        placeholder="Type your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onInput={handleTyping}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
