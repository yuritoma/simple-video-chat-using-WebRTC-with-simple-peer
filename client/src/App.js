// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VideoChat from './VideoChat';

const App = () => {
  const [roomId, setRoomId] = useState('');

  const handleStart = () => {
    // Trim and validate the room ID
    const trimmedRoomId = roomId.trim();
    if (trimmedRoomId !== '') {
      // Redirect to the video chat route with the room ID as a hash
      window.location.href = `/video-chat/${trimmedRoomId}`;
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <label htmlFor="roomId">Room ID:</label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID"
              />
              <button onClick={handleStart} disabled={!roomId}>
                Start Video Chat
              </button>
            </div>
          }
        />
        <Route
          path="/video-chat/:roomId"
          element={<VideoChat />}
        />
      </Routes>
    </Router>
  );
};

export default App;
