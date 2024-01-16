const { Router } = require("express")
const mongoose = require("mongoose")
const Player = require("../models/player.db")
const PlayerRouter = Router()

// Create
PlayerRouter.post("/addPlayer", async (req, res) => {
    try {
        const existingPlayer = await Player.findOne({ name: req.body.name })
        if (existingPlayer) {
            res.status(403).json({ error: "Player with the same name already exists" })
        } else {
            const newPlayer = new Player({
                name: req.body.name,
                runs: req.body.runs,
                sold: req.body.sold
            })
            const player = newPlayer.save()
            res.status(201).json({msg: "Player is created",
                name: player.name
            })
        }
    } catch(err) {
        console.log(err)    
        res.status(500).json({ msg: "Oops!! Something is up with our server" })
    }
})

// Read all the players
PlayerRouter.get("/allPlayers", async (req, res) => {
    try {
        const players = await Player.find()
        res.status(200).json(players)
    } catch (err) {
        res.status(500).json({ error: "Some error, please try again" })
    }
})

// Read a specific player
PlayerRouter.get("/getPlayer", async (req, res) => {
    const { name } = req.body;
    try {
        const player = await Player.findOne({ name: name });
        if (!player) res.status(404).json({ error: "Player not found" });
        res.status(200).json(player);
    } catch (err) {
        res.status(500).json({ error: "Some error, please try again" });
    }
})

// Update
PlayerRouter.put("/changeStatus", async (req, res) => {
    try {
        const findPlayer = await Player.findOne({ name: req.body.name })
        if (!findPlayer) {
            res.status(403).json({ msg: "This player does not exist"})
        } else {
            findPlayer.sold = findPlayer.sold === true ? false : true
            const player = await findPlayer.save()
            res.status(200).json({
                msg: "Successfully updated the player with new status",
                name: player.name,
                status: player.sold
            })
        }
    } catch(err) {
        res.status(500).json({ msg: "Oops!! Something is up with our server" })
    }
})

// delete
PlayerRouter.delete("/deletePlayer", async (req, res) => {
    try {
        const deletePlayer = await Player.deleteOne({ name: req.body.name })
        if (!deletePlayer) {
            res.status(403).json({ msg: "This player does not exist"})
        } else {
            res.status(200).json({
                msg: "Successfully deleted the player",
                name: deletePlayer.name
            })
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ msg: "Oops!! Something is up with our server" })
    }
})


module.exports = PlayerRouter