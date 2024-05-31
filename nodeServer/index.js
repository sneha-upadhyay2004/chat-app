const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: 'http://192.168.0.147:5501', // Client's origin
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true
    }
  });

// Enable CORS for all routes
app.use(cors());

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        // Broadcast the message to other users
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
    
});

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
