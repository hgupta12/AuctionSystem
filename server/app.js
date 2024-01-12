const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {"origin": "*"}
});
const PORT = 5000

require('./routes/socket.route')(io)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
