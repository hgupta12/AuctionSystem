const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PlayerRouter = require('./routes/player.route');
const TeamRouter = require('./routes/team.route');
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/auction")

app.use(bodyParser.json());
app.use(cors());

app.use("/", PlayerRouter);
app.use("/teams", TeamRouter);

app.listen(4000, 
    () => console.log("Server running on port 4000"));