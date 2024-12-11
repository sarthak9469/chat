import React, { useState } from 'react';
import JoinChat from './JoinChat';
import ChatRoom from './ChatRoom';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');

  return (
    <div>
      {username ? (
        <ChatRoom key={username} username={username} />
      ) : (
        <JoinChat onJoin={(name) => setUsername(name)} />
      )}
    </div>
  );
};

export default App;
