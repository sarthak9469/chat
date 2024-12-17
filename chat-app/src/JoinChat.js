import React, { useState } from 'react';

const JoinChat = ({ onJoin }) => {
  const [user1Id, setUser1Id] = useState('');
  const [user2Id, setUser2Id] = useState('');

  const handleJoin = async () => {
    if (user1Id.trim() && user2Id.trim()) {
      const response = await fetch('http://localhost:2000/api/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1Id, user2Id }),
      });

      const data = await response.json();
      if (response.ok && data.chatId) {
        onJoin(user1Id, user2Id);
      } else {
        console.error('Failed to initiate chat:', data.message);
      }
    } else {
      console.error('Both user IDs are required');
    }
  };

  return (
    <div id="username-container">
      <h1>Join Chat</h1>
      <input
        type="text"
        placeholder="Enter your username"
        value={user1Id}
        onChange={(e) => setUser1Id(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter the other user's username"
        value={user2Id}
        onChange={(e) => setUser2Id(e.target.value)}
      />
      <button onClick={handleJoin}>Join Chat</button>
    </div>
  );
};

export default JoinChat;
