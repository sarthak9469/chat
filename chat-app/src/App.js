import React, { useState } from 'react';
import JoinChat from './JoinChat';
import ChatRoom from './ChatRoom';
import './App.css';

const App = () => {
  const [username, setUsername] = useState('');
  const [otherUsername, setOtherUsername] = useState(''); // Add this state

  return (
    <div>
      {username ? (
        <ChatRoom username={username} otherUsername={otherUsername} />
      ) : (
        <JoinChat
          onJoin={(name, otherName) => {
            setUsername(name);
            setOtherUsername(otherName);
          }}
        />
      )}
    </div>
  );
};

export default App;
