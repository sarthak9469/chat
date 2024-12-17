import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:2000');

const ChatRoom = ({ username, otherUsername }) => {
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
      const chatId = `${username}-${otherUsername}`; // Use `username` and `otherUsername` for `chatId`

      socket.emit('user-message', { chatId, sender: username, message });

      try {
        const response = await fetch('http://localhost:2000/api/send', {
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

        if (!response.ok) {
          const error = await response.json();
          console.error('Error sending message:', error);
        }

        setMessage(''); 
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { username, isTyping: message !== '' });
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
