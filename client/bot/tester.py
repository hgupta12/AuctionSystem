import random

players_data = [
    {
        "index": i + 1,
        "rating": round(random.uniform(5.0, 10.0), 1),
        "role": random.choice(["bat", "bowl", "all"]),
        "base_price": random.randint(50, 150),
        "current_price": 0,
        "state": 0,
    }
    for i in range(30)
]

# Ensure that the indices are in increasing order
players_data.sort(key=lambda x: x["index"])

# Set current_price to base_price initially
for player in players_data:
    player["current_price"] = player["base_price"]

# print(players_data)

from bot import Bot

bot = Bot(initial_budget=15) #This is in cr -> create_bot in socket

for epoch in range(1000):
    for player_json_obj in players_data:
        #This is what you do in one episode
        
        #Initally set the default value to introduce the player -> new_player in socket
        player_json_obj["state"] = 0
        
        print(player_json_obj)
        print()
        print(bot.get_optimal_action(player_json_obj))
        
        #Initally at the start of the epoch
        player_json_obj["state"] = 1
        player_json_obj["current_price"] = player_json_obj["base_price"]
        
        step = 0
        
        while step < 10:
            # bid_process in socket
            #Updates
            step += 1
            
            player_json_obj["current_price"] += random.randint(0, 10)
            
            print(player_json_obj)
            print()
            
            #Action taking
            action = bot.get_optimal_action(player_json_obj)
            print(f"Step {step}: {action}")
        
        if player_json_obj["current_price"] > int(bot.team.budget*100): #If more than purse, don't give
            player_json_obj["state"] = 2
        else:
            if random.random() > 0.5:
                player_json_obj["state"] = 2
            else:
                player_json_obj["state"] = 3
            
        action = bot.get_optimal_action(player_json_obj)
        if action is not None:
            print(action)
            
    bot.result()
    bot.reset()