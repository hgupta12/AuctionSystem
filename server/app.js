const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const app = express();
const PlayerRouter = require('./routes/player.route');
const TeamRouter = require('./routes/team.route');
const mongoose = require("mongoose")

// For the http server
mongoose.connect("mongodb://localhost:27017/auction")

app.use(bodyParser.json());
app.use(cors());

app.use("/", PlayerRouter);
app.use("/teams", TeamRouter);

// For the websocket server
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {"origin": "*"}
});
require('./routes/socket.route')(io)

app.listen(4000, () => {
    console.log("HTTP Server running on port 4000")
});

server.listen(5000, () => {
    console.log("Websocket Server is running on port 5000");
});