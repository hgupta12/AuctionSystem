const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {"origin": "*"}
});
const PORT = 5000

const clients = []
const maxClients = 3
const interested = []
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
    }
]

let curPlayer = 0
io.on("connection", (socket) => {
    console.log(`\n\nNew client connected - ${socket.id}`);
    clients.push(socket.id)
    socket.emit("clientID", socket.id);
    
    if(clients.length === maxClients) { 
        io.emit("startGame", clients);
    }
    socket.on("disconnect", () => {
        // remove client from clients array
        const index = clients.indexOf(socket.id);
        if (index > -1) {
            clients.splice(index, 1);
        }
        console.log("\n\nClient disconnected")
    });
    
    socket.on("ready", () => {
        if (curPlayer == players.length){
            console.log("\n\nNo more players - ending game!")
            socket.emit("game_over")
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
                curPlayer++
                responseCounter = 0
                // empty interested array
                interested.length = 0
            }else if (interested.length == 1){
                // mark player as sold and move to next player
                io.emit("player_over", {
                    status: 'sold',
                    player: players[curPlayer],
                    winner: interested[0]
                })
                console.log(`\n\nOne bid - player ${curPlayer} sold to ${interested[0]}`)
                curPlayer++
                responseCounter = 0
                // empty interested array
                interested.length = 0
            } else {
                // choose random two bidders and let them bid.
                let random1 = Math.floor(Math.random() * interested.length)
                let random2 = Math.floor(Math.random() * interested.length)
                while(random1 == random2){
                    random2 = Math.floor(Math.random() * interested.length)
                }
                console.log(`${interested[random1]} - bids on player ${curPlayer}`)
                console.log(`${interested[random2]} - bids on player ${curPlayer}`)
                io.emit("bid", {
                    player: players[curPlayer],
                    currentHolder: interested[random2],
                    bidder: interested[random1],
                    price: players[curPlayer].price
                })
                interested.length = 0
                responseCounter = 0
            }
        }
    })

    socket.on("bid", (msg)=>{
        if (msg.currentHolder == socket.id) {
            console.log(`${socket.id} - bids on player ${curPlayer}`)
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
                console.log(`No new bidders - player ${curPlayer} sold to ${msg.currentHolder}\n\n`)
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
                console.log(`${interested[random1]} - bids for player ${curPlayer}`)
                io.emit("bid", {
                    player: players[curPlayer],
                    currentHolder: interested[random1],
                    bidder: msg.currentHolder,
                    price: players[curPlayer].price
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
