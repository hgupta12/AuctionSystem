const kafka = require('kafka-node')

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' })
const producer = new kafka.Producer(client)

function sendMessage (topic, message) {
  const payloads = [
    { topic, messages: JSON.stringify(message), partition: 0 }
  ]
  producer.send(payloads, (err, data) => {
    if (err) console.error(err)
    else console.log('Message sent to Kafka:', data)
  })
}

module.exports = {
  sendMessage
}
