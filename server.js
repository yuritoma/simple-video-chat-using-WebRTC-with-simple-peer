// Updated server.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const corsOptions = {
  credentials: true,
  origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));

mongoose.connect('mongodb+srv://yuritoma4:<password>@andrey.v78ia01.mongodb.net/');

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
