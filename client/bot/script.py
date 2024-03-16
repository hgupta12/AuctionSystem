import csv
import random
import json

players_data = []

def calculate_rating(player) -> float:
    """
    Finds how valuable the player is to the team
    """
    batting_weight = 0.6
    bowling_weight = 0.4
    batting_rating = (float(player["runs_scored"]) * float(player["batting_average"])) / float(player["ball_faced"]) if float(player["ball_faced"]) > 0 else 0
    bowling_rating = (float(player["wickets"]) * float(player["bowling_strike_rate"])) / float(player["runs_conceded"]) if float(player["runs_conceded"]) > 0 else 0
    overall_rating = (batting_weight * batting_rating) + (bowling_weight * bowling_rating)
    return round(overall_rating, 3)

def csv_to_json(file_path: str) -> None:
    """
    Convert the CSV players data to JSON data
    """
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
                "rating": calculate_rating(player),
                "role": role,
                "base_price": base_price,
                "current_price": current_price,
                "state": state
            }
            players_data.append(player_obj)

    with open('./players.json', 'w') as players_json:
        json.dump(players_data, players_json, indent=4)

csv_to_json('../../data/players.csv')