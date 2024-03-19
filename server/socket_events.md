# Socket events

The following events are used to communicate between the socket server and socket client to conduct the auction.

A `Player` object is used in several event messages. It has the following shape:
```js
{
    "id": number, // the id of the player up for auction
    "name": string, // name of the player
    "price": number, // base price of the player
    "status": string,
    "owner": string
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
- A response to this has to be sent by all agents using the [`first_bid`](#first_bid) event

### bid
- Triggered during a two-agent bidding
- Contains:
```js
{
    "player": Player, // player currently in bidding
    "currentHolder": string, // client ID of the current holder of the player
    "bidder": string, // client ID of the other agent who can bid on the player
    "price": number // the price bid by "currentHolder"
}
```
- A response to this has to be sent by the `bidder` agent, using the [`bid`](#bid-1) event

### new_bid_request
- Triggered after the two-agent bid is complete
- Requests for other teams to match the final price from the bid
- Contains:
```js
{
    "player": Player, // the player currently auctioning
    "currentHolder": string, // client ID representing the winner of the bid
    "price": number, // the new price of the player after the bid
}
```
- A response to this has to be sent by all agents using [`add_new_bidder`](#add_new_bidder) event

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
- Triggered when there are no more players to be auctioned

<br>

## Events sent by client

### ready
- To be sent when the client is ready for the auction of the next player

### first_bid
- Sent in response to [`new_player`](#new_player) event
- Contains: `boolean` value representing whether or not the agent is interested in the current player

> <u>Note:</u> If no teams are interested in the player, they go unsold. If one team is interested in the player, the player is sold to that team. Otherwise, two of the interested teams are chosen at random and start a bidding process.

### bid
- Sent in response to [`bid`](#bid) event
- Contains the same structure of data as [`bid`](#bid) event
- If the agent wishes to back out of the bid, the exact same object received from the server should be sent back through this event
- If the agent wishes to bid further, the `currentHolder` and `bidder` field values should be interchanged, and the `price` field has to be updated with the new bid

### add_new_bidder
- Sent in response to [`new_bid_request`](#new_bid_request) event
- Should contain a copy of the object received from [`new_bid_request`](#new_bid_request), along with an extra field `choice`. This field is a `boolean` value representing whether the agent is interested in matching the bid of `currentHolder`

> <u>Note:</u> If there are no agents interested, the `currentHolder` automatically gets the player. Otherwise, one of the interested teams are chosen and the bidding process is started again between the chosen team and `currentHolder`.