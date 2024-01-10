import socketio
import random

# Create a Socket.IO client instance
sio = socketio.Client()
client = ""

# Connect to the server
sio.connect('http://localhost:5000')

# Define event handlers
@sio.event
def connect():
    print('Connected to the server')

@sio.event
def disconnect():
    print('Disconnected from the server')

@sio.event
def clientID(id):
    global client
    client = id
    print(f"My ID - {id}")

@sio.event
def startGame(clients):
    print(f"Game started with clients -\n {clients}")
    sio.emit('ready')

@sio.event
def new_player(player):
    print(f"New player up for auction - {player}")
    value  = random.random()
    if value > 0.5:
        print("Bid")
        sio.emit('first_bid', True)
    else:
        print("Pass")
        sio.emit('first_bid', False)

@sio.event
def player_over(msg):
    print(msg)
    sio.emit('ready')

@sio.event
def bid(msg):
    print(msg)
    if(msg.get('bidder') == client):
        value  = random.random()
        if value > 0.5:
            print("Bid")
            otherBidder = msg.get('currentHolder')
            msg['currentHolder'] =  client
            msg['bidder'] = otherBidder
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
    if msg['currentHolder'] == client:
        print("You are the current holder")

        sio.emit('add_new_bidder', {
            "choice": False,
            "currentHolder": msg['currentHolder']
        })
        return
    print(f"Another chance to bid on {msg['player']}")
    value  = random.random()
    if value > 0.5:
        print("Bid")
        sio.emit('add_new_bidder',  {
            "choice": True,
            "currentHolder": msg['currentHolder']
        })
    else:
        print("Pass")
        sio.emit('add_new_bidder', {
            "choice": False,
            "currentHolder": msg['currentHolder']
        })

# Start the event loop
sio.wait()
