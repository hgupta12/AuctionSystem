import socketio
import random
import time

"""
API endpoints:
1) create_bot -> initialize the bot instance at the very start of the training, with an initial budget
2) new_player -> tell the bot that a new player is up for auction -> Bot returns bid or not bid
3) bid_process -> tell the bot, about the player with updated price -> Bot returns bid or not bid
4) end_bid -> tell the bot, if they have got the player or not with the price
5) end_epoch -> tell the bot to reset it's team, because one epoch of training is over
"""

# Create a Socket.IO client instance
sio = socketio.Client()
client = ""
money = 0

# Connect to the server
sio.connect('http://localhost:5000')

# Define event handlers
@sio.event
def connect():
    print('Connected to the server')

@sio.event
def disconnect():
    print(f"{client} - remaining purse - {money}")
    print('Disconnected from the server')

@sio.event
def clientID(msg):
    global client
    global money
    client = msg['id']
    money = msg['purse']
    print(f"My ID - {client}")

@sio.event
def startGame():
    print(f"Game started!")
    sio.emit('ready')

@sio.event
def new_player(player):
    time.sleep(0.5)
    print(f"New player up for auction - {player}")
    if player.get('price') > money:
        sio.emit('first_bid', False)
    else:
        value  = random.random()
        if value > 0.5:
            print("Bid")
            sio.emit('first_bid', True)
        else:
            print("Pass")
            sio.emit('first_bid', False)

@sio.event
def purse_changed(amount):
    global money
    money = amount
    print(f"My purse - {money}")

@sio.event
def player_over(msg):
    print(msg)
    sio.emit('ready')

@sio.event
def bid(msg):
    print(msg)
    time.sleep(0.5)
    if(msg.get('bidder') == client):
        if msg.get('price') + 100 > money:
            sio.emit('bid', msg)
            return
        value  = random.random()
        if value > 0.5:
            print("Bid")
            otherBidder = msg.get('currentHolder')
            msg['currentHolder'] =  client
            msg['bidder'] = otherBidder
            msg['price'] = msg['price'] + 100
            print(msg)
            sio.emit('bid', msg)
        else:
            print("Pass")
            sio.emit('bid', msg)

@sio.event
def game_over():
    print("Game over!")   
    sio.disconnect()
    exit(1)

@sio.event
def new_bid_request(msg):
    time.sleep(0.5)
    if msg['currentHolder'] == client:
        print("You are the current holder")

        sio.emit('add_new_bidder', {
            "choice": False,
            "currentHolder": msg['currentHolder'],
            "price": msg['price']
        })
        return
    print(f"Another chance to bid on {msg['player']}")
    if msg['price'] + 100 > money:
        print("Pass")
        sio.emit('add_new_bidder', {
            "choice": False,
            "currentHolder": msg['currentHolder'],
            "price": msg['price']
        })
        return
    value  = random.random()
    if value > 0.5:
        print("Bid")
        sio.emit('add_new_bidder',  {
            "choice": True,
            "currentHolder": msg['currentHolder'],
            "price": msg['price']
        })
    else:
        print("Pass")
        sio.emit('add_new_bidder', {
            "choice": False,
            "currentHolder": msg['currentHolder'],
            "price": msg['price']
        })

# Start the event loop
sio.wait()
