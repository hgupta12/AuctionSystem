const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {"origin": "*"}
});
const PORT = 5000

const clients = new Map()
const clientSockets = new Map()
const startingPurse = 1000
const maxClients = 8
let interested = []
let responseCounter = 0

const players = [
    {
        id: 1,
        name: "Player 1",
        price: 100,
        status: null,
        owner: null
    },
    {
        id: 2,
        name: "Player 2",
        price: 200,
        status: null,
        owner: null
    },
    {
        id: 3,
        name: "Player 3",
        price: 100,
        status: null,
        owner: null
    },
    {
        id: 4,
        name: "Player 4",
        price: 200,
        status: null,
        owner: null
    },
    {
        id: 5,
        name: "Player 5",
        price: 100,
        status: null,
        owner: null
    },
    {
        id: 6,
        name: "Player 6",
        price: 200,
        status: null,
        owner: null
    },
    {
        id: 7,
        name: "Player 7",
        price: 100,
        status: null,
        owner: null
    },
    {
        id: 8,
        name: "Player 8",
        price: 200,
        status: null,
        owner: null
    },

]

let curPlayer = 0
io.on("connection", (socket) => {
    console.log(`\n\nNew client connected - ${socket.id}`);
    clients.set(socket.id, startingPurse)
    clientSockets.set(socket.id, socket)
    socket.emit("clientID", {
        id: socket.id,
        purse: startingPurse
    });
    
    if(clients.size === maxClients) { 
        io.emit("startGame");
    }
    socket.on("disconnect", () => {
        // remove client from clients array
        clients.delete(socket.id)
        clientSockets.delete(socket.id)
        console.log("\n\nClient disconnected")
    });
    
    socket.on("ready", () => {
        if (curPlayer == players.length){
            console.log("\n\nNo more players - ending game!")
            io.emit("game_over")
            console.log(players)
            return
        }
        console.log(`Sending new player info. - ${curPlayer}`)
        socket.emit("new_player", players[curPlayer])

    })

    socket.on("first_bid", (msg)=>{
        console.log(`${socket.id} - ${msg}`)
        responseCounter += 1
        if(msg == true){
            interested.push(socket.id)
        }
        if(responseCounter == maxClients){
            if(interested.length == 0){
                // mark player as unsold and move to next player
                io.emit("player_over", {
                    status: 'unsold',
                    player: players[curPlayer]
                })
                console.log(`\n\nNo bids - player${curPlayer} unsold`)
                players[curPlayer].status = "unsold"
                curPlayer++
                responseCounter = 0
                // empty interested array
                interested.length = 0
            }else if (interested.length == 1){
                // mark player as sold and move to next player
                
                console.log(`\n\nOne bid - player ${curPlayer} sold to ${interested[0]} for ${players[curPlayer].price}}`)
                players[curPlayer].status = "sold"
                players[curPlayer].owner = interested[0]
                clients.set(interested[0], clients.get(interested[0]) - players[curPlayer].price)
                clientSockets.get(interested[0]).emit("purse_changed", clients.get(interested[0]))
                io.emit("player_over", {
                    status: 'sold',
                    player: players[curPlayer],
                    winner: interested[0]
                })
                curPlayer++
                responseCounter = 0
                // empty interested array
                interested.length = 0
            } else {
                // choose random two bidders and let them bid.
                let random1 = Math.floor(Math.random() * interested.length)
                firstBidder = interested[random1]
                // filter out random1 and anyone whose purse is less than price + 100
                interested = interested.filter((bidder)=>{
                    if(bidder == firstBidder || clients.get(bidder) < players[curPlayer].price + 100){
                        return false
                    }
                    return true
                })

                if(interested.length == 0) {
                    // mark player as sold and move to next player
                    console.log(`\n\nOne bid - player ${curPlayer} sold to ${firstBidder} for ${players[curPlayer].price}}`)
                    players[curPlayer].status = "sold"
                    players[curPlayer].owner = firstBidder
                    clients.set(firstBidder, clients.get(firstBidder) - players[curPlayer].price)
                    clientSockets.get(firstBidder).emit("purse_changed", clients.get(interested[0]))
                    io.emit("player_over", {
                        status: 'sold',
                        player: players[curPlayer],
                        winner: firstBidder
                    })
                    curPlayer++
                } else {
                    let random2 = Math.floor(Math.random() * interested.length)
                    const secondBidder = interested[random2]
                    console.log(`${firstBidder} - bids on player ${curPlayer} for ${players[curPlayer].price}`)
                    console.log(`${interested[random2]} - bids on player ${curPlayer} for ${players[curPlayer].price + 100}`)
                    io.emit("bid", {
                        player: players[curPlayer],
                        currentHolder: secondBidder,
                        bidder: firstBidder,
                        price: players[curPlayer].price + 100
                    })
                }
                interested.length = 0
                responseCounter = 0
            }
        }
    })

    socket.on("bid", (msg)=>{
        if (msg.currentHolder == socket.id) {
            console.log(`${socket.id} - bids on player ${curPlayer} for ${msg.price}`)
            io.emit("bid", {
                player: players[curPlayer],
                currentHolder: msg.currentHolder,
                bidder: msg.bidder,
                price: msg.price
            })
        }else {
            // take in more bids
            console.log(`${msg.bidder} - backs out`)
            console.log(`New Bids Requested`)
            io.emit("new_bid_request",{
                player: players[curPlayer],
                currentHolder: msg.currentHolder,
                price: msg.price
            })
        }
    })

    socket.on("add_new_bidder", (msg)=>{
        responseCounter += 1
        if (msg.choice === true) {
            interested.push(socket.id)
        }
        if (responseCounter == maxClients){
            if(interested.length == 0){
                // mark player as unsold and move to next player
                console.log(`No new bidders - player ${curPlayer} sold to ${msg.currentHolder} for ${msg.price} \n\n`)
                players[curPlayer].status = "sold"
                players[curPlayer].owner = msg.currentHolder
                players[curPlayer].price = msg.price
                clients.set(msg.currentHolder, clients.get(msg.currentHolder) - msg.price)
                clientSockets.get(msg.currentHolder).emit("purse_changed", clients.get(msg.currentHolder))
                io.emit("player_over", {
                    status: 'sold',
                    player: players[curPlayer],
                    winner: msg.currentHolder
                })
                curPlayer++
                responseCounter = 0
                // empty interested array
                interested.length = 0
            } else {
                // choose a random bidder and let them bid.
                let random1 = Math.floor(Math.random() * interested.length)
                console.log(`${interested[random1]} - bids for player ${curPlayer} for ${msg.price + 100} \n\n`)
                io.emit("bid", {
                    player: players[curPlayer],
                    currentHolder: interested[random1],
                    bidder: msg.currentHolder,
                    price: msg.price + 100
                })
                interested.length = 0
                responseCounter = 0
            }
        }
    })

})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
