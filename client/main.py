import socketio
import random
import time
from bot import Bot

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
bot = None

# Connect to the server
sio.connect('http://localhost:5000')

# Define event handlers
@sio.event
def connect():
    print('Connected to the server')
    
@sio.event
def create_bot(msg):
    """
    This function creates the instance of the Bot for this client locally.
    
    Message parameters:
    1) purse: The initial budget of the bot in crores
    """
    global bot
    
    bot = Bot(initial_budget=msg['purse'])
    
    print(f"Bot created with purse - {msg['purse']}")
    sio.emit('create_bot', {
        "id": client,
        "purse": money
    })
    
@sio.event
def new_player(player):
    """
    This function is called when a new player is up for auction.
    It sends the 0 signal to the bot.
    
    Message Parameters:
    A player dictionary object with the following parameters:
    "index" : The index of the player referencing it in the backend
    "rating" : The rating of the player
    "role" : The role of the player
    "base_price" : The base price of the player in Lakhs
    "current_price" : The current price of the player in Lakhs, which is the same as the base price initially
    "state": 0
    """
    global bot
    
    print(f"New player up for auction - {player}")
    
    if player.get('current_price') > bot.team.budget*100: #The team budget is in crores
        sio.emit('first_bid',False)
    else:
        action = bot.get_optimal_action(player)
        print(action)
        sio.emit('first_bid',action=="bid")
    
    # if player.get('price') > money:
    #     sio.emit('first_bid', False)
    # else:
        
    #     if value > 0.5:
    #         print("Bid")
    #         sio.emit('first_bid', True)
    #     else:
    #         print("Pass")
    #         sio.emit('first_bid', False)

@sio.event
def bid_process(player):
    """
    This function is called when the price of a player is updated.
    It sends the 1 signal to the bot.
    
    Message Parameters:
    A player dictionary object with the following parameters:
    "index" : The index of the player referencing it in the backend
    "rating" : The rating of the player
    "role" : The role of the player
    "base_price" : The base price of the player in Lakhs
    "current_price" : The current price of the player in Lakhs, which is different, as the auction progresses
    "state": 1
    """
    global bot
    
    print(f"Player price updated - {player}")
    
    action = bot.get_optimal_action(player)
    print(action)
    sio.emit('new_bid', action=="bid")  
    
@sio.event
def end_bid(player):
    """
    This function is called when the player is sold or not sold.
    It sends the 2 signal to the bot.
    
    Message Parameters:
    A player dictionary object with the following parameters:
    "index" : The index of the player referencing it in the backend
    "rating" : The rating of the player
    "role" : The role of the player
    "base_price" : The base price of the player in Lakhs
    "current_price" : The current price of the player in Lakhs, which is different, as the auction progresses
    "state": 2 if the player is not given to the bot, 3 if the player is given to the bot
    """
    global bot
    
    print(f"Player auction ended - {player}")
    
    bot.get_optimal_action(player)
    
    sio.emit('end_bid', player)
    
@sio.event
def end_epoch():
    """
    This function is called when the epoch ends.
    It resets the bot's SAR sequence for training.
    """
    global bot
    
    print(f"Epoch ended")
    
    bot.reset()
    
    sio.emit('end_epoch')




# @sio.event
# def disconnect():
#     print(f"{client} - remaining purse - {money}")
#     print('Disconnected from the server')

# @sio.event
# def clientID(msg):
#     global client
#     global money
#     client = msg['id']
#     money = msg['purse']
#     print(f"My ID - {client}")

# @sio.event
# def startGame():
#     print(f"Game started!")
#     sio.emit('ready')

# @sio.event
# def purse_changed(amount):
#     global money
#     money = amount
#     print(f"My purse - {money}")

# @sio.event
# def player_over(msg):
#     print(msg)
#     sio.emit('ready')

# @sio.event
# def bid(msg):
#     print(msg)
#     time.sleep(0.5)
#     if(msg.get('bidder') == client):
#         if msg.get('price') + 100 > money:
#             sio.emit('bid', msg)
#             return
#         value  = random.random()
#         if value > 0.5:
#             print("Bid")
#             otherBidder = msg.get('currentHolder')
#             msg['currentHolder'] =  client
#             msg['bidder'] = otherBidder
#             msg['price'] = msg['price'] + 100
#             print(msg)
#             sio.emit('bid', msg)
#         else:
#             print("Pass")
#             sio.emit('bid', msg)

# @sio.event
# def game_over():
#     print("Game over!")   
#     sio.disconnect()
#     exit(1)

# @sio.event
# def new_bid_request(msg):
#     time.sleep(0.5)
#     if msg['currentHolder'] == client:
#         print("You are the current holder")

#         sio.emit('add_new_bidder', {
#             "choice": False,
#             "currentHolder": msg['currentHolder'],
#             "price": msg['price']
#         })
#         return
#     print(f"Another chance to bid on {msg['player']}")
#     if msg['price'] + 100 > money:
#         print("Pass")
#         sio.emit('add_new_bidder', {
#             "choice": False,
#             "currentHolder": msg['currentHolder'],
#             "price": msg['price']
#         })
#         return
#     value  = random.random()
#     if value > 0.5:
#         print("Bid")
#         sio.emit('add_new_bidder',  {
#             "choice": True,
#             "currentHolder": msg['currentHolder'],
#             "price": msg['price']
#         })
#     else:
#         print("Pass")
#         sio.emit('add_new_bidder', {
#             "choice": False,
#             "currentHolder": msg['currentHolder'],
#             "price": msg['price']
#         })

# Start the event loop
sio.wait()
