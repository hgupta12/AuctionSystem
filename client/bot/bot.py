import numpy as np

"""
A state in the RL Model is defined as follows:
I) The current bid price - this is in ranges -> 0-50L, 50L-100L, 100L-150L,..., 300L+ -> 7 ranges
II) The current team rating - this is a score of 0-10 -> as a function of team balance and following accordance with rules
III) The current player rating - this is a score of 0-10 -> as a function of player balance and following accordance with rules
IV) The current budget - this is in ranges -> 10cr with 1 cr slabs and 10cr+ -> as a function of budget
V) The available actions - bid or not bid

The state space is defined as the cartesian product of the above 4 ranges.
Since we are dealing with action-value pairs, we will have the four ranges and the fifth dimension will be bid or not bid.

Can include:
- Terminal states

NOTE: Up to the backend not to give the player if enough purse not there
"""

def episodic_reward_function(team, player, final_price, received):
    """
    This function is supposed to calculate the reward for the given episode.
    It considers the players already in the team. Based on whether the player is received or not, it calculates the reward.
    
    For now, the simple logic is, if you could buy it and you didn't then you get a negative reward, else you get a positive reward.WORK REQUIRED!!!!
    Ideas:
    
    - Look at batters and bowlers, and see the team balance
    - Classify based on foriegners
    """
    
    team_rating_diff = team.get_team_rating() - player.rating
    
    if not received:
        if team_rating_diff < 0 and team.budget > final_price:
            return -0.1*team_rating_diff #How much you missed out on
        else:
            return 0.1*team_rating_diff #How much you saved
    else:
        if team_rating_diff < 0 and team.budget > final_price:
            #Higher proportion since you had to actually pay
            return 0.5*team_rating_diff 
        else:
            return -0.5*team_rating_diff
        
def step_reward_function():
    """
    This is a filler function, you might want to add somethings to this later on
    """
    return np.random.rand()/100

class SAManager():
    def __init__(self, bidding_ranges=[(0,50),(50,100),(100,150),(150,200),(200,250),(250,300),(300,1000)], #This is in L
                 team_rating_ranges=[i for i in range(11)], 
                 player_rating_ranges=[i for i in range(11)], 
                 budget_ranges=[(0,1),(1,2),(2,3),(3,4),(4,5),(5,6),(6,7),(7,8),(8,9),(9,10),(10,100)], #This is in cr
                 available_actions=["bid", "not_bid"]):
        
        self.bidding_ranges = bidding_ranges
        self.team_rating_ranges = team_rating_ranges
        self.player_rating_ranges = player_rating_ranges
        self.budget_ranges = budget_ranges
        self.available_actions = available_actions
        
        no_bidding_ranges = len(bidding_ranges)
        no_team_rating_ranges = len(team_rating_ranges)
        no_player_rating_ranges = len(player_rating_ranges)
        no_budget_ranges = len(budget_ranges)
        no_available_actions = len(available_actions)
        
        self.Q = np.random.rand(no_bidding_ranges, no_team_rating_ranges, no_player_rating_ranges, no_budget_ranges, no_available_actions)
        
        self.N = np.ones((no_bidding_ranges, no_team_rating_ranges, no_player_rating_ranges, no_budget_ranges, no_available_actions))
        
    def get_state(self, current_bid_price, current_team_rating, current_player_rating, current_budget, action):
        """
        Parameters:
        current_bid_price: The current bid price in Lakhs
        current_team_rating: The current team rating in 0-10, or the custom defined range
        current_player_rating: The current player rating in 0-10, or the custom defined range   
        current_budget: The current budget in Crores
        action: The action to be taken - bid or not bid, or custom defined actions
        
        Returns:
        The tuple for the state based on the current bidding situation
        """
        
        for bid_range in self.bidding_ranges:
            if bid_range[0] <= current_bid_price and current_bid_price < bid_range[1]:
                current_bid_price = self.bidding_ranges.index(bid_range)
                break
            
        for team_rating_range in self.team_rating_ranges:
            if int(team_rating_range) == int(current_team_rating):
                current_team_rating = self.team_rating_ranges.index(team_rating_range)
                break
            
        for player_rating_range in self.player_rating_ranges:
            if int(player_rating_range) == int(current_player_rating):
                current_player_rating = self.player_rating_ranges.index(player_rating_range)
                break
            
        for budget_range in self.budget_ranges:
            if budget_range[0] <= current_budget and current_budget < budget_range[1]:
                current_budget = self.budget_ranges.index(budget_range)
                break
            
        if action == "bid":
            action = 0
        elif action == "not_bid":
            action = 1
            
        if current_budget < 0:
            #   If you don't have money then you can't bid
            current_budget = 0
            action = "not_bid"
            
        return (current_bid_price, current_team_rating, current_player_rating, current_budget, action)
        
    def get_reward(self, current_bid_price, current_team_rating, current_player_rating, current_budget, action):
        """
        Parameters:
        current_bid_price: The current bid price in Lakhs
        current_team_rating: The current team rating in 0-10, or the custom defined range
        current_player_rating: The current player rating in 0-10, or the custom defined range   
        current_budget: The current budget in Crores
        action: The action to be taken - bid or not bid, or custom defined actions
        
        Returns:
        The reward for the given state and action
        """
        
        index = self.get_state(current_bid_price, current_team_rating, current_player_rating, current_budget, action)
        
        return self.Q[index]
    
    def get_optimal_action(self, current_bid_price, current_team_rating, current_player_rating, current_budget):
        """
        Parameters:
        current_bid_price: The current bid price in Lakhs
        current_team_rating: The current team rating in 0-10, or the custom defined range
        current_player_rating: The current player rating in 0-10, or the custom defined range   
        current_budget: The current budget in Crores
        
        Returns:
        The optimal action to be taken - bid or not bid, or custom defined actions
        """
        
        state = self.get_state(current_bid_price, current_team_rating, current_player_rating, current_budget, "bid")[:-1] #We don't need the action here

        optimal_action_index = np.argmax(self.Q[*state,:])
        
        return (state, self.available_actions[optimal_action_index])
    
    def increment_n(self,state,action):
        """
        This function is used while training the bot
        Parameters:
        state: The state for which the N value is to be incremented
        action: The action for which the N value is to be incremented
        """
        
        self.N[*state,action] += 1

class Player():
    def __init__(self, rating, role, index, base_price=None, final_price=None):
        """
        Parameters:
        rating: The rating of the player
        role: The role of the player
        index: The unique identifier for the player
        """
        
        self.rating = rating
        self.role = role
        self.index = index
        
        if base_price is not None:
            self.base_price = base_price
        
        if final_price is not None:
            self.final_price = final_price

class Team():
    def __init__(self, initial_budget):
        """
        Here, the players are stored as indices(unique identifiers) and have their ratings as well
        """
        self.players = []
        self.budget = initial_budget
        
    def empty(self,initial_budget):
        self.players = []
        self.budget = initial_budget
        
    def add_player(self, player_object):
        """
        Parameters:
        player_object: The player object to be added to the team - should consist of an identifier index and other information
        """
        
        self.players.append(player_object)
        
    def get_player(self, index):
        """
        Parameters:
        index: The index of the player to be returned
        
        Returns:
        The player object with the given index
        """
        
        return self.players[index]
    
    def get_team_rating(self):
        """
        Returns:
        The team rating as a function of the player ratings, FOR NOW a simple average is taken
        """
        
        #Make a rating system for bowling, batting and all rounders
        
        if len(self.players) == 0:
            return 0
        
        return sum([player.rating for player in self.players])/len(self.players)

class Bot():
    def __init__(self, initial_budget):
        self.mode = "running" # running is for taking it through the auction, training is for between the episodes
        
        self.team = Team(initial_budget)
        self.initial_budget = initial_budget
        
        self.sar_sequence = []
        
        self._initialize_state_dict()
        
        #Hyperparameters
        self.alpha = 0.02
        self.gamma = 0.9
        self.epsilon = 0.1
    
    def _initialize_state_dict(self):
        self._sa_manager = SAManager()
        
    def _record_episode_step(self,state,action,reward):
        action_map = {"bid":0, "not_bid":1}
        action = action_map[action]
        self.sar_sequence.append((state,action,reward))
    
    def _train_model(self):
        """
        This function is supposed to update the Q values
        """
        
        state_list, action_list, reward_list = zip(*self.sar_sequence)
        
        G = 0
        for t in range(len(state_list)-1,-1,-1):
            reward_t = reward_list[t]
            
            if reward_t == 0:
                continue
            
            state_t = state_list[t]
            action_t = action_list[t]
            
            G = self.gamma * G + reward_t
            self._sa_manager.increment_n(state_t,action_t)
            oldQ = self._sa_manager.Q[*state_t,action_t]

            self._sa_manager.Q[*state_t,action_t] = oldQ + self.alpha * (G - oldQ) / self._sa_manager.N[*state_t,action_t] 
    
    def reset(self):
        """
        This function is called once the episode ends to reset the team and the SAR sequence
        """
        self.sar_sequence = []
        self.team.empty(self.initial_budget)
    
    def result(self):
        print()
        print("Initial Budget: ", self.initial_budget, "cr")
        print("Remaining Purse: ", self.team.budget, "cr")
        print("The final team is:")
        for player in self.team.players:
            print(f"Player {player.index}: {player.role} rated at {player.rating} initially costing {player.base_price}L bought at {player.final_price}L")
    
    def get_optimal_action(self,player_json_object):
        """
        Parameters:
        player_json_object: The json object containing the player information
        It should contain the following:
        - The player's rating
        - The player's current price (in lakhs)
        - The player's role
        - The player's index
        - The state of the player (these act as SIGNALS) - 
            If new player to bid then 0;
            if in auction then 1;
            not awarded to us then 2;
            awarded to us then 3
        
        Returns:
        The optimal action to be taken - bid or not bid, or custom defined actions if in auction
        If not in auction, then it returns None
        """
        
        if player_json_object["state"] == 0:
            #New player introduced
            
            #Add player
            new_player = Player(player_json_object["rating"], player_json_object["role"], player_json_object["index"])
            
            #Change the mode of the Bot to running
            self.mode = "running"
            self.base_price = player_json_object["base_price"]
            
            #Get the optimal action
            current_state, optimal_action = self._sa_manager.get_optimal_action(player_json_object["current_price"], #Here, the current price will be the base price
                                                       self.team.get_team_rating(), 
                                                       new_player.rating, 
                                                       self.team.budget)
            
            
            
            self._record_episode_step(current_state, optimal_action, step_reward_function()) #The reward is 0 since that calculation hasn't been done yet CHANGE!!
            
            return optimal_action
            
        elif player_json_object["state"] == 1:
            #In auction
            player_obj = Player(player_json_object["rating"], player_json_object["role"], player_json_object["index"])
            
            #Get the optimal action
            current_state, optimal_action = self._sa_manager.get_optimal_action(player_json_object["current_price"],
                                                       self.team.get_team_rating(), 
                                                       player_obj.rating, 
                                                       self.team.budget)
            
            self._record_episode_step(current_state, optimal_action, step_reward_function()) #The reward is 0 since that calculation hasn't been done yet CHANGE!!
            
            return optimal_action
            
        else:
            # Auction Ends
            final_price = player_json_object["current_price"]
            
            base_price = player_json_object["base_price"]
            
            player_obj = Player(player_json_object["rating"], player_json_object["role"], player_json_object["index"],base_price=base_price,final_price=final_price)
            
            current_state, _ = self._sa_manager.get_optimal_action(player_json_object["current_price"],
                                                       self.team.get_team_rating(), 
                                                       player_obj.rating, 
                                                       self.team.budget)
            
            if player_json_object["state"] == 2:
                #Not awarded to us
                reward = episodic_reward_function(self.team, player_obj, final_price, False)
                
                self._record_episode_step(current_state, "not_bid", reward) #This not bid part is by virtue of not taking player
            else:
                #Awarded to us                
                
                #Reward Calculation
                reward = episodic_reward_function(self.team, player_obj, final_price, True)
                
                #Change budget
                self.team.budget -= player_json_object["current_price"]/100
                
                #Add player to team
                self.team.add_player(player_obj)
                
                self._record_episode_step(current_state, "bid", reward) #Terminates with BID CHANGEEEE!!!

            #Change the mode to training, since Monte-Carlo
            self.mode = "training"

            #Update the actions values
            self._train_model()