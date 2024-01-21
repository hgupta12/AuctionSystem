const { Router } = require('express')
const Player = require('../../models/player.db')
const Team = require('../../models/team.db')
const TeamRouter = Router()

// Read all the teams
TeamRouter.get('/allteams', async (req, res) => {
  try {
    const teams = await Team.find()
    res.status(200).json(teams)
  } catch (err) {
    res.status(500).json({ error: 'Some error, please try again' })
  }
})

// Read a specific team
TeamRouter.get('/getTeam', async (req, res) => {
  const teamName = req.params.team
  try {
    const team = await Team.findOne({ name: teamName })
    if (!team) res.status(404).json({ error: 'Team not found' })
    res.status(200).json(team)
  } catch (err) {
    res.status(500).json({ error: 'Some error, please try again' })
  }
})

// Create a team
TeamRouter.post('/createTeam', async (req, res) => {
  const teamName = req.body.team
  try {
    const team = await Team.create({ name: teamName })
    res.status(200).json({
      msg: 'Team created successfully',
      teamname: team.name
    })
  } catch (err) {
    res.status(500).json({ error: 'Some error, please try again' })
  }
})

// Update a team i.e add a player to a team
TeamRouter.post('/addPlayer', async (req, res) => {
  const teamName = req.body.team
  const playerName = req.body.name
  try {
    const player = await Player.findOne({ name: playerName })
    if (!player) {
      res.status(404).json({ error: 'Player not found' })
    } else {
      const team = await Team.findOne({ name: teamName })
      if (!team) {
        res.status(404).json({ error: 'Team not found' })
      } else {
        team.players.push(player)
        const updatedTeam = await team.save()
        res.status(200).json(updatedTeam)
      }
    }
  } catch (err) {
    res.status(500).json({ error: 'Some error, please try again' })
  }
})

module.exports = TeamRouter
