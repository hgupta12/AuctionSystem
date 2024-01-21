const express = require('express')
const kafka = require('kafka-node')
const replayRouter = express.Router()

replayRouter.get('/', async (req, res) => {
  try {
    const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' })
    const topics = [{ topic: 'auction', partition: 0 }]
    const options = { fromOffset: 'earliest' }
    const consumer = new kafka.Consumer(client, topics, options)
    const messages = []

    consumer.on('message', function (message) {
      messages.push(message)
    })

    consumer.on('error', function (err) {
      console.error('Error:', err)
      res.status(500).json({ error: 'Error reading from Kafka', details: err })
    })

    consumer.on('offsetOutOfRange', function (err) {
      console.error('Offset out of range:', err)
      res.status(500).json({ error: 'Offset out of range', details: err })
    })

    // Close the consumer after some time
    setTimeout(() => {
      consumer.close(true, () => {
        res.json(messages)
      })
    }, 2000)
  } catch (err) {
    res.status(500).json({ error: 'Some error, please try again', details: err })
  }
})

module.exports = replayRouter
