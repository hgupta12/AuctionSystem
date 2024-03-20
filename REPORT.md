# IPL Auction Simulator <img src="https://www.jagranimages.com/images/newimg/21082020/21_08_2020-ipl_logo_20650553.jpg" alt="IPL" width="64" height="64" align="center"/>

This project attempts to build a small-scale simulation of what is commonly referred to as a *pre-season* **mini-auction** for the IPL. In addition, we incorporate *Reinforcement Learning* to enable the teams to make reasonably intelligent decisions, on who to bid for and for what price.

## Aim

 As mentioned previously, this project aims to build a basic IPL auction simulator, with teams making intelligent decisions on which players to choose. The detailed features of this are as follows:
    - In order to model the IPL auction process appropriately, set up a *Markov Decision Process* (**MDP**), defining appropriate *states* of the auction/team, *actions* that the teams in the auction can take and an appropriate *reward system*, to enable the RL-agent to learn from the experience effectively.
    - Based on the **MDP** setup, choose an appropriate RL algorithm (especially based on the *rewards*) that not only enables learning, but also fits into IPL auction simulator system the best.
    - Build an IPL mini-auction simulator: a socket client-server based system, wherein the server acts as the auctioneer, and the different clients emulate the different teams in the auction.
    - Integrate the simulator with a high-level UI, to enable users to see the ongoing auction-simulation.
    - *Add any extra brief info about high-level backend requirements!*

## Prerequisites

We will now introduce some preliminaries, to help better understand the workflow of our project.

### About the IPL auction

The Indian Premier League is a global-level T20 cricket league that is annually held in India. There are 10 teams(2024), which each have a min/max of 16/25 players. In order to help slightly balance out teams and introduce rising cricketers into the IPL (both domestic and foreign), the annual IPL mini-auction is conducted (as opposed to a *mega-auction*, which is beyond the scope of this project). 

In the mini-auction, teams have an already semi-built team, and try to gain a few extra players to fill in specific requirements, like requiring some spinners, need a finisher/opener, etc. Teams are given a common *purse*, which is reduced based on the already *retained* players. Utilizing strategies and careful usage of the remaining *purse*, teams will attempt to maximize their overall team quality, without exceeding their purse.

### MDP-based Reinforcement Learning

In classical RL, the major mathematical modelling is based on a *Markov Decision Process* (**MDP**). Formally, an MDP is a 4-tuple(S, A~s~, P~a~ , R~a~), wherein:
    - S is set of all possible states. 
    (typical terminology: s - current states, s' - next state)
    - A~s~ is the set of all actions possible from the current state s $\epsilon$ S.
    (typical terminology: s - current action, s' - next action)
    - P~a~ is the probability distribution function (involves s and s'), which shows *Pr of landing in s', having been in s and committing a*.
    - R~a~ is the reward function (involves s and s'), which returns *Reward received from the environment for landing in s', having been in s and committing a*.
    The overall **MDP** is visually represented as the below cycle-diagram:

<div align="center">
<img src="https://miro.medium.com/v2/resize:fit:1400/1*ywOrdJAHgSL5RP-AuxsfJQ.png" alt="MDP" align="center"/>
</div>

Once the 4-tuple(S, A~s~, P~a~ , R~a~) is setup for a problem, our objective is to maximize the expected reward that is obtained in a run-through of the problem. In classical RL, this is done by estimating the *values* of state-action (s, a) pairs, denoted Q(s, a). Formally, Q is the expected discounted reward obtained in a single iteration of the problem (an *episode*). This is aptly formulated as follows:

Q<sup>$\pi$</sup>(s, a) = **E**<sub>$\pi$</sub> [ $\sum_{k=0}^{\infty}$ $\gamma$^k^ r~t+k+1~ | s~t~ = s, a~t~ = a ]  

In the literature, optimal values for Q(s, a) are obtained using the Bellman equation:
Q^*^(s, a) = R(s, a) + $\gamma$ $\sum$ <sub>s'$\epsilon$ S</sub> P~ss'~(a) $\max_{a' \epsilon A(s')}$ Q^*^(s', a')

Also, based on these optimal Q^*^(s,a) values, a policy $\pi$ is determined as follows:

 $\pi$^*^(s) = $\arg\max_a$ q<sup>$\pi$</sup>(s,a)

In reality, we would never have access to P~ss'~, since this is an intrinsic property of the environment, which is likely only partially/never revealed. In addition, the above optimal solution is only exactly attainable, in the limit of infinity. Hence, we turn to some of the existing value-based approximation algorithms, to achieve reasonable optimality, in finite time.

### Monte-Carlo RL

Monte-Carlo (*MC*) for Reinforcement Learning is an important value-based model free algorithm, whose specialty lies in the fact that the Q-values are updated at the end of an *episode*. This way, equation (FILL WITH EQU) is as closely emulated is possible. Furthermore, one immediate advantage of *MC* is that it can distribute the discounted reward to all the states that occur in an episode. This is particularly useful in scarce-reward scenarios (when the reward is just 0/1), or when the reward is given at the end of the episode (ex: 0 or 1 for losing or winning a round of Blackjack). An overall view of the algorithm is shown below:

<div align="center">
<img src="https://miro.medium.com/v2/resize:fit:1400/1*2lG-_LFi6LdmYWlTPVXKhQ.png" alt="On Policy MC"/>
</div>

To see an example tutorial of implementing the above algorithm in a Gymnasium environment (as show below), refer our repository: [**TODO: link for my repo**]

<div align="center">
<img src="https://www.gymlibrary.dev/_images/blackjack.gif" alt="Blackjack" width="" height="150" />
</div>

### Any Simulator-Specific Prereq?

## Methodology

(*TODO: Vishy + Hariharan + Menors? will do this*)
## Results

(*TODO: Based on actual running of the simulator; we'll include photos of the sim in action*)
## Conclusions

(*TODO: I dunno*)
## References

(*TODO: Vishy will do this*