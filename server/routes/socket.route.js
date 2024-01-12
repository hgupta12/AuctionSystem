const clients = new Map()
const clientSockets = new Map()
const startingPurse = 1000
const maxClients = 8
let interested = []
let responseCounter = 0

const players = require('../players.json')

let curPlayer = 0

const socketRouter = (io) => {
  io.on("connection", (socket) => {
    // add new client
    clients.set(socket.id, startingPurse);
    clientSockets.set(socket.id, socket);

    socket.emit("clientID", {
      id: socket.id,
      purse: startingPurse,
    });

    // start the game if the number of clients reach the  required capacity
    if (clients.size === maxClients) {
      io.emit("startGame");
    }

    // when a client disconnects
    socket.on("disconnect", () => {
      // remove client
      clients.delete(socket.id);
      clientSockets.delete(socket.id);
      console.log("\n\nClient disconnected");
    });

    // when the clients ar ready to play the game
    socket.on("ready", () => {
      if (curPlayer == players.length) {
        console.log("\n\nNo more players - ending game!");
        io.emit("game_over");
        console.log(players);
        return;
      }
      console.log(`Sending new player info. - ${curPlayer}`);
      socket.emit("new_player", players[curPlayer]);
    });

    // 1st bid for a player
    socket.on("first_bid", (msg) => {
      console.log(`${socket.id} - ${msg}`);
      responseCounter += 1;
      if (msg == true) {
        interested.push(socket.id);
      }
      if (responseCounter == maxClients) {
        // if no one is interested, mark player as unsold and move to next player
        if (interested.length == 0) {
          // mark player as unsold and move to next player
          io.emit("player_over", {
            status: "unsold",
            player: players[curPlayer],
          });
          console.log(`\n\nNo bids - player${curPlayer} unsold`);
          players[curPlayer].status = "unsold";
          curPlayer++;
        }
        // if only one person is interested, mark player as sold and move to next player
        else if (interested.length == 1) {
          // mark player as sold and move to next player

          console.log(
            `\n\nOne bid - player ${curPlayer} sold to ${interested[0]} for ${players[curPlayer].price}}`
          );
          players[curPlayer].status = "sold";
          players[curPlayer].owner = interested[0];
          clients.set(
            interested[0],
            clients.get(interested[0]) - players[curPlayer].price
          );
          clientSockets
            .get(interested[0])
            .emit("purse_changed", clients.get(interested[0]));
          io.emit("player_over", {
            status: "sold",
            player: players[curPlayer],
            winner: interested[0],
          });
          curPlayer++;
        }
        // more than one person is interested
        else {
          // choose the first bidder randomly. He gets the base price.
          let random1 = Math.floor(Math.random() * interested.length);
          firstBidder = interested[random1];
          // filter out the firstBidder and anyone who can't afford the next price
          interested = interested.filter((bidder) => {
            if (
              bidder == firstBidder ||
              clients.get(bidder) < players[curPlayer].price + 100
            ) {
              return false;
            }
            return true;
          });
          // if no one else can afford the player, mark player as sold and move to next player
          if (interested.length == 0) {
            // mark player as sold and move to next player
            console.log(
              `\n\nOne bid - player ${curPlayer} sold to ${firstBidder} for ${players[curPlayer].price}}`
            );
            players[curPlayer].status = "sold";
            players[curPlayer].owner = firstBidder;
            clients.set(
              firstBidder,
              clients.get(firstBidder) - players[curPlayer].price
            );
            clientSockets
              .get(firstBidder)
              .emit("purse_changed", clients.get(interested[0]));
            io.emit("player_over", {
              status: "sold",
              player: players[curPlayer],
              winner: firstBidder,
            });
            curPlayer++;
          }
          // choose the second bidder. the second bidder bids the next price and the first bidder is prompted for the next price.
          else {
            let random2 = Math.floor(Math.random() * interested.length);
            const secondBidder = interested[random2];
            console.log(
              `${firstBidder} - bids on player ${curPlayer} for ${players[curPlayer].price}`
            );
            console.log(
              `${interested[random2]} - bids on player ${curPlayer} for ${
                players[curPlayer].price + 100
              }`
            );
            io.emit("bid", {
              player: players[curPlayer],
              currentHolder: secondBidder,
              bidder: firstBidder,
              price: players[curPlayer].price + 100,
            });
          }
        }
        responseCounter=0
        interested.length = 0;
      }
    });

    socket.on("bid", (msg) => {
      if (msg.currentHolder == socket.id) {
        console.log(
          `${socket.id} - bids on player ${curPlayer} for ${msg.price}`
        );
        io.emit("bid", {
          player: players[curPlayer],
          currentHolder: msg.currentHolder,
          bidder: msg.bidder,
          price: msg.price,
        });
      } else {
        // take in more bids
        console.log(`${msg.bidder} - backs out`);
        console.log(`New Bids Requested`);
        io.emit("new_bid_request", {
          player: players[curPlayer],
          currentHolder: msg.currentHolder,
          price: msg.price,
        });
      }
    });

    socket.on("add_new_bidder", (msg) => {
      responseCounter += 1;
      if (msg.choice === true) {
        interested.push(socket.id);
      }
      if (responseCounter == maxClients) {
        if (interested.length == 0) {
          // mark player as unsold and move to next player
          console.log(
            `No new bidders - player ${curPlayer} sold to ${msg.currentHolder} for ${msg.price} \n\n`
          );
          players[curPlayer].status = "sold";
          players[curPlayer].owner = msg.currentHolder;
          players[curPlayer].price = msg.price;
          clients.set(
            msg.currentHolder,
            clients.get(msg.currentHolder) - msg.price
          );
          clientSockets
            .get(msg.currentHolder)
            .emit("purse_changed", clients.get(msg.currentHolder));
          io.emit("player_over", {
            status: "sold",
            player: players[curPlayer],
            winner: msg.currentHolder,
          });
          curPlayer++;
          responseCounter = 0;
          // empty interested array
          interested.length = 0;
        } else {
          // choose a random bidder and let them bid.
          let random1 = Math.floor(Math.random() * interested.length);
          console.log(
            `${interested[random1]} - bids for player ${curPlayer} for ${
              msg.price + 100
            } \n\n`
          );
          io.emit("bid", {
            player: players[curPlayer],
            currentHolder: interested[random1],
            bidder: msg.currentHolder,
            price: msg.price + 100,
          });
          interested.length = 0;
          responseCounter = 0;
        }
      }
    });
  });
};

module.exports = socketRouter;
