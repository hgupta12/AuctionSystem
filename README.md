# IPL Auction Simulator
## Introduction
This project is done under IEEE NITK. This is a simulation of the auctioning process of Indian Premier League (IPL). The clients are team franchises and the server is the auctioneer. The server is responsible for managing the auction and the clients are responsible for bidding for players. But the clients are not the regular clients. They are Reinforcement Learning agents which improve their policy of choosing the palyers based on a variety of factors.

## What is IPL?
The Indian Premier League (IPL) auction is an annual event in which cricket franchises bid for players to build their teams for the upcoming season of the IPL, a professional Twenty20 cricket league in India. The auction provides an opportunity for teams to acquire new players, release existing ones, and strategize to strengthen their squads.

## Running the Project

### Setting up the Environment
1. Rename ``.env.example`` to ``.env`` and fill in the required environment variables.

### Setting up the Infrastructure
1. Run the command ``docker-compose up`` to start the infrastructure or add the flag ``-d`` to run it in the background in detached mode.
2. Following are the port mappings for the services:
    - **MongoDB** - 27017
    - **Mongo express** (to manage MongoDB) - 8081
    - **Redis** - 6379
    - **Redis Stack** (GUI to manage Redis) - 8001
    - **Kafka** - 9092
    - **KafDrop** (GUI to manage Kafka) - 9000
3. Run the command ``docker-compose down`` to bring down the infrastructure.

## Running the client and server
1. Run the command ``npm install`` in the ``client`` and ``server`` directories to install the dependencies.
2. Run the command ``npm run dev`` in the ``client`` and ``server`` directories to start the client and server respectively.

## Requirements 
1. [Docker and Docker-Compose](https://docs.docker.com/get-docker/)
2. [Python version >= 3.7](https://www.python.org/downloads/)
2. [Node.js](https://nodejs.org/en/download/)

