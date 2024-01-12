const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const playerRouter = require('./routes');

app.use(bodyParser.json());
app.use(cors());

app.use("/", playerRouter);

app.listen(4000, 
    () => console.log("Server running on port 4000"
));