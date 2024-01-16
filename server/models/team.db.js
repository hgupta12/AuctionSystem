const mongoose = require('mongoose')
const { Schema } = mongoose

const TeamSchema = new Schema({
  name: String,
  players: Array
})

const Team = mongoose.model('Team', TeamSchema)
module.exports = Team
