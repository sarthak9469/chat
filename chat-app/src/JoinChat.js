import React, { useState } from 'react';

const JoinChat = ({ onJoin }) => {
  const [username, setUsername] = useState('');
  const [otherUsername, setOtherUsername] = useState('');

  const handleJoin = async () => {
    if (username.trim() && otherUsername.trim()) {
      const response = await fetch('http://localhost:2000/api/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1: username, user2: otherUsername }),
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
      <input
        type="text"
        placeholder="Enter the other user's username"
        value={otherUsername}
        onChange={(e) => setOtherUsername(e.target.value)}
      />
      <button onClick={handleJoin}>Join Chat</button>
    </div>
  );
};

export default JoinChat;
