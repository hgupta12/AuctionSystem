const { createClient } = require('redis')

const redisClient = createClient({ legacyMode: true })
async function connectRedis () {
  try {
    await redisClient.connect()
  } catch (err) {
    console.log('Error connecting to Redis:', err)
  }
}

connectRedis()

module.exports = { redisClient }
