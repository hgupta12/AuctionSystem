# Socket events

The following events are used to communicate between the socket server and socket client to conduct the auction.

A `Player` object is used in several event messages. It has the following shape:
```js
{
    "id": number, // the id of the player up for auction
    "name": string, // name of the player
    "price": number, // base price of the player
    "status": string, // idk what this is
    "owner": string // idk what this is
}
```

## Events sent by server

### clientID
- Triggered immediately on connection
- Contains:
```js
{
    "id": string, // client ID,
    "purse": number // the amount of money allotted to the team
}
```

### startGame
- Triggered when required number of agents have connected to the server

### new_player
- Triggered when a new player is up on auction
- Only triggered on response to `ready` event from each client
- Contains: `Player` object representing the player up for auction



### purse_changed
- Triggered when there is a change in the amount of money remaining for a specific agent
- Contains: `number` representing the new balance of the agent

### player_over
- Triggered when the auction for a specific player is complete
- If only one team was interested in a player, they automatically get the player without entering the two-team bidding stage
- Contains:
```js
{
    "status": string, // representing result of the bidding for the specific player,
    "player": Player, // player info
    "winner"?: string, // representing client ID of the agent who obtained the player
    "money"?: number, // price payed by the winner for the player
}
```
> <u>Note:</u> "?" next to the property name represents an optional field.
- possible values of status are:

value | meaning | optional fields included
------|---------|--------------------------
unsold | no agent was interested in the player | -
sold | sold to some agent | `winner`, `money`



### GAME OVER

<br>

## Events sent by client

### ready


### first_bid
- Sent in response to `new_player` event
- Contains: `boolean` value representing whether or not the agent is interested in the current player
