const kafka = require('kafka-node')
const client = require('./producer.js')
const Team = require('../models/team.db')

const consumer = new kafka.Consumer(
  client,
  [{ topic: 'auction', partition: 0 }],
  { autoCommit: true }
)

consumer.on('message', function (message) {
  const data = JSON.parse(message.value)

  // Save the data to Team database
  Team.save(data)
    .then(() => console.log('Data saved to DB'))
    .catch(err => console.error('Error saving data to DB:', err))
})
