const { Router } = require('express');
const Lobby = require('../models/lobbyModel');
const auth = require('../middleware/authMiddleware')
const { io } = require('../server')

const router = new Router()

router.post('/rooms', auth, async (req, res, next) => {
  const roomName = req.body.name
  if (!roomName) {
    res.status(400).send({
      message: 'Please supply a valid room name'
    })
  } else {
    const existingLobby = await Lobby.findOne({ where: { name: roomName } })
    if (existingLobby) {
      res.status(409).send('Room name is already in use')
    } else {
      Lobby.create({ ...req.body })
        .then(room => {
          if (room) {
            io.emit('addRoom', room)
            res.status(200).send('Room created succesfully')
          } else {
            res.status(400).send('Failed creating room')
          }
        })
        .catch(next)
    }
  }
})

router.get('/rooms', auth, (req, res, next) => {
  Lobby.findAll()
    .then(rooms => {
      if (rooms) {
        res.status(200).send(rooms)
      } else {
        res.status(400).send('Error getting rooms')
      }
    })
    .catch(next)
})

module.exports = router