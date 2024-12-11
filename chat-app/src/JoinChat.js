import React, { useState } from 'react';

const JoinChat = ({ onJoin }) => {
  const [username, setUsername] = useState('');

  const handleJoin = async () => {
    if (username.trim()) {
      // Assuming you want to initiate a chat with another user
      const otherUser = 'otherUser';  // You can fetch this dynamically
      const response = await fetch('http://localhost:7000/api/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1: username, user2: otherUser }),
      });

      const data = await response.json();
      if (data.chatId) {
        onJoin(username);  // Proceed with joining the chat
      } else {
        console.error('Failed to initiate chat:', data.message);
      }
    }
  };

  return (
    <div id="username-container">
      <h1>Join Chat</h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleJoin}>Join Chat</button>
    </div>
  );
};

export default JoinChat;
