const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {"origin": "*"}
});
const PORT = 5000

io.on("connection", (socket) => {
    console.log(`New client connected - ${socket.id}`);
    socket.on("disconnect", () => console.log("Client disconnected"));
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
