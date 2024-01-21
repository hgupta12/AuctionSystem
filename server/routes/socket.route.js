const { redisClient } = require('../redis/cache.js')
const { sendMessage } = require('../kafka/producer.js')
const axios = require('axios')
const clients = new Map()
const clientSockets = new Map()
const startingPurse = 1000
const maxClients = 8
let interested = []
let responseCounter = 0
let curPlayer = 0
const players = require('../players.json')
// async function getData ({ name }) {
//   try {
//     const response = await axios.get('http://localhost:4000/getPlayer', {
//       params: {
//         name
//       }
//     })
//     if (response.data) {
//       players.push(response.data)
//     }
//   } catch (error) {
//     console.error(`Error fetching player data: ${error}`)
//   }
// }

// getData({ name: 'Dhoni' })

// const redisClient = createClient({ legacyMode: true })
// async function connectRedis () {
//   try {
//     await redisClient.connect()
//   } catch (err) {
//     console.log('Error connecting to Redis:', err)
//   }
// }

// connectRedis()

const socketRouter = (io) => {
  io.on('connection', (socket) => {
    // add new client
    clients.set(socket.id, startingPurse)
    clientSockets.set(socket.id, socket)

    socket.emit('clientID', {
      id: socket.id,
      purse: startingPurse
    })
    sendMessage('auction', { id: socket.id, purse: startingPurse })

    // start the game if the number of clients reach the required capacity
    if (clients.size === maxClients) {
      io.emit('startGame')
      sendMessage('auction', { msg: 'Game started' })
    }

    // when a client disconnects
    socket.on('disconnect', () => {
      // remove client
      clients.delete(socket.id)
      clientSockets.delete(socket.id)
      console.log(`\n\nClient with sokcet id ${socket.id} disconnected`)
      sendMessage('auction', { id: socket.id, msg: 'disconnected' })
    })

    // when the clients are ready to play the game
    socket.on('ready', () => {
      if (curPlayer === players.length) {
        console.log('\n\nNo more players - ending game!')
        io.emit('GAME OVER')
        sendMessage('auction', { msg: 'Game over' })
        console.log(players)
        return
      }
      console.log(`Sending new player info. - ${curPlayer}`)
      socket.emit('new_player', players[curPlayer])
      sendMessage('auction', { msg: 'New player', player: players[curPlayer] })
    })

    // 1st bid for a player
    socket.on('first_bid', (msg) => {
      console.log(`${socket.id} - ${msg}`)
      responseCounter += 1
      if (msg === true) {
        interested.push(socket.id)
      }
      if (responseCounter === maxClients) {
        // if no one is interested, mark player as unsold and move to next player
        if (interested.length === 0) {
          // mark player as unsold and move to next player
          const unsoldPlayer = {
            status: 'unsold',
            player: players[curPlayer]
          }
          io.emit('player_over', unsoldPlayer)
          sendMessage('auction', { msg: 'Player unsold', unsoldPlayer })
          console.log(`\n\nNo bids - player${curPlayer} unsold`)
          players[curPlayer].status = 'unsold'
          curPlayer++
        } else if (interested.length === 1) { // if only one person is interested, mark player as sold and move to next player
          // mark player as sold and move to next player
          console.log(
            `\n\nOne bid - player ${curPlayer} sold to ${interested[0]} for ${players[curPlayer].price}}`
          )
          players[curPlayer].status = 'sold'
          players[curPlayer].owner = interested[0]
          clients.set(
            interested[0],
            clients.get(interested[0]) - players[curPlayer].price
          )
          clientSockets
            .get(interested[0])
            .emit('purse_changed', clients.get(interested[0]))
          const soldPlayer = {
            status: 'sold',
            player: players[curPlayer],
            winner: interested[0],
            money: players[curPlayer].price
          }
          io.emit('player_over', soldPlayer)
          console.log('Player is getting sold')
          const key = Date.now()
          redisClient.set(key, JSON.stringify(soldPlayer))
          sendMessage('auction', { msg: 'Player sold', soldPlayer })
          curPlayer++
        } else { // more than one person is interested
          // choose the first bidder randomly. He gets the base price.
          const random1 = Math.floor(Math.random() * interested.length)
          const firstBidder = interested[random1]
          // filter out the firstBidder and anyone who can't afford the next price
          interested = interested.filter((bidder) => {
            if (
              bidder === firstBidder ||
              clients.get(bidder) < players[curPlayer].price + 100
            ) {
              return false
            }
            return true
          })
          // if no one else can afford the player, mark player as sold and move to next player
          if (interested.length === 0) {
            // mark player as sold and move to next player
            console.log(
              `\n\nOne bid - player ${curPlayer} sold to ${firstBidder} for ${players[curPlayer].price}}`
            )
            players[curPlayer].status = 'sold'
            players[curPlayer].owner = firstBidder
            clients.set(
              firstBidder,
              clients.get(firstBidder) - players[curPlayer].price
            )
            clientSockets
              .get(firstBidder)
              .emit('purse_changed', clients.get(interested[0]))
            const soldPlayer = {
              status: 'sold',
              player: players[curPlayer],
              winner: firstBidder,
              money: players[curPlayer].price
            }
            console.log('Player is getting sold')
            io.emit('player_over', soldPlayer)
            const key = Date.now()
            redisClient.set(key, JSON.stringify(soldPlayer))
            sendMessage('auction', { msg: 'Player sold', soldPlayer })
            curPlayer++
          } else { // choose the second bidder. the second bidder bids the next price and the first bidder is prompted for the next price.
            const random2 = Math.floor(Math.random() * interested.length)
            const secondBidder = interested[random2]
            console.log(
              `${firstBidder} - bids on player ${curPlayer} for ${players[curPlayer].price}`
            )
            console.log(
              `${interested[random2]} - bids on player ${curPlayer} for ${
                players[curPlayer].price + 100
              }`
            )
            const increaseBidPlayer = {
              player: players[curPlayer],
              currentHolder: secondBidder,
              bidder: firstBidder,
              price: players[curPlayer].price + 100
            }
            io.emit('bid', increaseBidPlayer)
            sendMessage('auction', { msg: 'Bidding increase', increaseBidPlayer })
          }
        }
        responseCounter = 0
        interested.length = 0
      }
    })

    socket.on('bid', (msg) => {
      if (msg.currentHolder === socket.id) {
        console.log(
          `${socket.id} - bids on player ${curPlayer} for ${msg.price}`
        )
        const bidPlayer = {
          player: players[curPlayer],
          currentHolder: msg.currentHolder,
          bidder: msg.bidder,
          price: msg.price
        }
        io.emit('bid', bidPlayer)
        sendMessage('auction', { msg: 'Bidding increase', bidPlayer })
      } else {
        // take in more bids
        console.log(`${msg.bidder} - backs out`)
        console.log('New Bids Requested')
        const newPlayer = {
          player: players[curPlayer],
          currentHolder: msg.currentHolder,
          price: msg.price
        }
        io.emit('new_bid_request', newPlayer)
        sendMessage('auction', { msg: 'New bid request', newPlayer })
      }
    })

    socket.on('add_new_bidder', (msg) => {
      responseCounter += 1
      if (msg.choice === true) {
        interested.push(socket.id)
      }
      if (responseCounter === maxClients) {
        if (interested.length === 0) {
          // mark player as unsold and move to next player
          console.log(
            `No new bidders - player ${curPlayer} sold to ${msg.currentHolder} for ${msg.price} \n\n`
          )
          players[curPlayer].status = 'sold'
          players[curPlayer].owner = msg.currentHolder
          players[curPlayer].price = msg.price
          clients.set(
            msg.currentHolder,
            clients.get(msg.currentHolder) - msg.price
          )
          clientSockets
            .get(msg.currentHolder)
            .emit('purse_changed', clients.get(msg.currentHolder))
          const soldPlayer = {
            status: 'sold',
            player: players[curPlayer],
            winner: msg.currentHolder,
            money: players[curPlayer].price
          }
          console.log('Player is getting sold')
          io.emit('player_over', soldPlayer)
          const key = Date.now()
          redisClient.set(key, JSON.stringify(soldPlayer))
          sendMessage('auction', { msg: 'Player sold', soldPlayer })
          curPlayer++
          responseCounter = 0
          // empty interested array
          interested.length = 0
        } else {
          // choose a random bidder and let them bid.
          const random1 = Math.floor(Math.random() * interested.length)
          console.log(
            `${interested[random1]} - bids for player ${curPlayer} for ${
              msg.price + 100
            } \n\n`
          )
          const increaseBidPlayer = {
            player: players[curPlayer],
            currentHolder: interested[random1],
            bidder: msg.currentHolder,
            price: msg.price + 100
          }
          io.emit('bid', increaseBidPlayer)
          sendMessage('auction', { msg: 'Bidding increase', increaseBidPlayer })
          interested.length = 0
          responseCounter = 0
        }
      }
    })
  })
}

module.exports = socketRouter
