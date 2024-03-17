import csv
import random
import json

players_data = []

def calculate_rating(player, max_ba, max_bsr) -> float:
    """
    Finds how valuable the player is to the team
    """
    batting_weight = 0.6
    bowling_weight = 0.4
    batting_rating = float(player['batting_average'])/max_ba
    bowling_rating = float(player['bowling_strike_rate'])/max_bsr
    # overall_rating = (batting_weight * batting_rating) + (bowling_weight * bowling_rating) #In the range 0-1
    overall_rating = max(batting_rating, bowling_rating)
    
    overall_rating *= 10
    
    return overall_rating

def csv_to_json(file_path: str) -> None:
    """
    Convert the CSV players data to JSON data
    """
    #CHANGE THE RATING CALCULATION
    max_ba = 0 #Batting average
    max_bsr = 0 #Bowling strike rate
    
    with open(file_path, 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        
        
        for player in reader:
            max_ba = max(max_ba, float(player['batting_average']))
            max_bsr = max(max_bsr, float(player['bowling_strike_rate']))
        
    with open(file_path, 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        
        for i, player in enumerate(reader):
            role = ""
            if float(player['runs_scored']) > 100:
                role = "batter"
            elif float(player['wickets']) > 10:
                role = "bowler"
            else:
                role = "all_rounder"
            base_price = random.randint(50, 100)
            current_price = 0
            state = 0
            player_obj = {
                "index": i + 1,
                "rating": calculate_rating(player, max_ba, max_bsr),
                "role": role,
                "base_price": base_price,
                "current_price": current_price,
                "state": state
            }
            players_data.append(player_obj)

    with open('./players.json', 'w') as players_json:
        json.dump(players_data, players_json, indent=4)

csv_to_json('../../data/players.csv')