from bot import Bot
import random
import logging
import json

'''
This section is just for testing
'''
# players_data = [
#     {
#         "index": i + 1,
#         "rating": round(random.uniform(5.0, 10.0), 1),
#         "role": random.choice(["bat", "bowl", "all"]),
#         "base_price": random.randint(50, 150),
#         "current_price": 0,
#         "state": 0,
#     }
#     for i in range(10)
# ]

with open('players.json') as f:
    players_data = json.load(f)

# Ensure that the indices are in increasing order
players_data.sort(key=lambda x: x["index"])

# Set current_price to base_price initially
for player in players_data:
    player["current_price"] = player["base_price"]
    
'''
This section is the actual code
'''
logging.basicConfig(format='%(message)s',level=logging.INFO)

logger = logging.getLogger()
logger.setLevel(logging.INFO)


class AuctionSimulation():
    def __init__(self, num_bots=4, training=False, initial_budget=20, increment_amt=10, max_bid_iter=None, no_train_epochs=1):
        self.initial_budget = initial_budget
        self.bots = [Bot(initial_budget) for i in range(num_bots)]
        self.increment_amt = increment_amt
        self.training = training
        if max_bid_iter is not None:
            self.max_bid_iter = max_bid_iter

        self.no_train_epochs = no_train_epochs if training else 1 #If training, then run for multiple epochs, else just for demonstration
        
    def simulate(self, player_data):
        for epoch_idx in range(self.no_train_epochs):
            for player_json_data in player_data:
                print()
                logger.info(f"\nPlayer: {player_json_data}")
                player_json_data['state'] = 0
                player_json_data["current_price"] = player_json_data["base_price"]
                prev_interested_index = -1
                
                for iter_no in range(self.max_bid_iter): #To put an upper cap on the bidding
                    logger.info(f"\nIteration {iter_no}")
                    interested = [False for _ in range(len(self.bots))]

                    for i,bot in enumerate(self.bots):
                        interested[i] = bot.get_optimal_action(player_json_data) == "bid" and (bot.team.budget*100 > player_json_data['current_price'])
                    
                    logger.info(f"Interested: {interested}")
                    
                    no_interested = sum(interested)
                    
                    if no_interested == 0:
                        if prev_interested_index == -1:
                            #Skip player
                            logger.info("No one interested")
                        else:
                            #Award it to the last interested guy
                            #Award it to that guy
                            player_json_data['state'] = 3
                            interested_index = prev_interested_index
                            self.bots[interested_index].get_optimal_action(player_json_data)
                            
                            #Tell the others that they didn't get it
                            player_json_data['state'] = 2
                            for i,bot in enumerate(self.bots):
                                if i != interested_index:
                                    bot.get_optimal_action(player_json_data)
                            logger.info(f"Player awarded to {interested_index}")
                        
                        break
                    elif no_interested == 1:
                        #Award it to that guy
                        player_json_data['state'] = 3
                        interested_index = interested.index(True)
                        self.bots[interested_index].get_optimal_action(player_json_data)
                        
                        #Tell the others that they didn't get it
                        player_json_data['state'] = 2
                        for i,bot in enumerate(self.bots):
                            if i != interested_index:
                                bot.get_optimal_action(player_json_data)
                        logger.info(f"Player awarded to {interested_index}")
                        
                        break
                    else:
                        #Continue the bidding
                        player_json_data['state'] = 1
                        
                        interested_indices = [i for i,ele in enumerate(interested) if ele]
                        
                        if prev_interested_index != -1 and prev_interested_index in interested_indices:
                            interested_indices.remove(prev_interested_index)
                        
                        #Randomly select another player for the bidding                    
                        chosen_index = random.choice(interested_indices)
                        prev_interested_index = chosen_index
                        
                        player_json_data['current_price'] += self.increment_amt
                        
                        logger.info(f"Player price: {player_json_data['current_price']}L with bot {chosen_index} bidding")
                    
                if self.training and epoch_idx != self.no_train_epochs - 1:
                    for i,bot in enumerate(self.bots):
                        bot.reset()    
                    
    def print_results(self):
        print()
        print("RESULTS")
        for bot_no,bot in enumerate(self.bots):
            logger.info(f"\nBot {bot_no}")
            bot.result()
            for player_statement in [f"Player {player.index}) {player.name}: {player.role} rated at {player.rating} initially costing {player.base_price}L bought at {player.final_price}L" for player in bot.team.players]:
                logger.info(player_statement)
                
    def save_weights(self):
        for i,bot in enumerate(self.bots):
            bot.save(f"bot_{i}")
        logger.info("Weights saved")

sim = AuctionSimulation(num_bots=4, max_bid_iter=1000, training=True, no_train_epochs=10)
sim.simulate(players_data)
sim.print_results()
sim.save_weights()