const { Server } = require('socket.io')
const { createAdapter } = require('@socket.io/redis-adapter')
const { createClient } = require('redis')

const io = new Server()

const pubClient = createClient({ url: 'redis://localhost:6379' })
const subClient = pubClient.duplicate()

subClient.subscribe('player_over')
subClient.on('message', (channel, message) => {
  console.log(`Message from channel ${channel}: ${message}`)
  const data = JSON.parse(message)
  console.log(data)
})

io.adapter(createAdapter(pubClient, subClient))

io.on('connection', (socket) => {
  console.log(`Web Socket server's socket id is: ${socket.id}`)
  socket.on('player_over', (data) => {
    if (data.sold === 'sold') {
      pubClient.publish('player_over', JSON.stringify(data))
    }
  })
})
