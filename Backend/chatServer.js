// Backend/chatServer.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Ganti dengan domain frontend kamu kalau perlu
    methods: ["GET", "POST"]
  }
});

const users = {};

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('set username', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('chat message', {
      username: 'System',
      message: `${username} telah bergabung.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  socket.on('chat message', (msg) => {
    const user = users[socket.id] || 'Anonymous';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    io.emit('chat message', { username: user, message: msg, time });
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      io.emit('chat message', {
        username: 'System',
        message: `${user} telah keluar.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      delete users[socket.id];
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`💬 Chat server running at http://localhost:${PORT}`);
});
