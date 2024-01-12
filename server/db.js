const mongoose = require("mongoose")
const { Schema } = mongoose

mongoose.connect("mongodb://localhost:27017/players")

// put stuff here according to the needs
const PlayerSchema = new Schema({
    name: String,
    runs: Number,
    sold: Boolean
})

const Player = mongoose.model("Player", PlayerSchema)

module.exports = Player
