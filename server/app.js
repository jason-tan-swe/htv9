import "dotenv/config"

import express from "express"
import { createServer } from "node:http"
import { Server } from "socket.io";
import cors from "cors"
import { connectToDatabase } from "./models/index.js";
import Alert from "./models/alert.js";
import User from "./models/user.js";
import Pact from "./models/pact.js";

const app = express();

app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});
connectToDatabase()
const port = 8080

/**
 * 1. Have rooms of two users through "friend code"
 * 2. Have users send "ready" messages
 * 
 */

io.on('connection', async (socket) => {
  console.log('a user connected');

  socket.on("pact:create", async (payload) => {
    const { email, pactMessage } = payload
    try {
      console.log(email, pactMessage)
      // Get the current player
      await connectToDatabase()
      const player = await User.findOne({ email })

      // Create a room in MongoDB with the current user
      const pact = new Pact({
        players: [player],
        playerOneMsg: pactMessage
      })
      await pact.save()

      // Join the player to a room
      await socket.join(pact.id)

      socket.data.pactId = pact.id
      
      // Emit to the players
      io.to(socket.id).emit("pact:join", {
        players: pact.players,
        pactId: pact.id,
        hasPlayerOneConfirmed: pact.hasPlayerOneConfirmed,
        hasPlayerTwoConfirmed: pact.hasPlayerTwoConfirmed,
        playerOneMsg: pactMessage,
        playerTwoMsg: '',
      })
    } catch (err) {
      console.error(err)
    }
  })
  socket.on("pact:join", async (payload) => {
    console.log("pact:join", payload)
    const { email, pactId, pactMessage } = payload
    try {
      // Get the current player
      await connectToDatabase()
      const player = await User.findOne({ email })

      // Get the pact to join and add the new player
      const pact = await Pact.findById(pactId).populate('players')
      pact.players.push(player)
      pact.playerTwoMsg = pactMessage

      // Save updates and reflect in socket
      await pact.save()
      await socket.join(pact.id)

      socket.data.pactId = pact.id
      
      // Emit to the players
      io.to(pact.id).emit("pact:join", {
        players: pact.players,
        pactId: pact.id,
        hasPlayerOneConfirmed: pact.hasPlayerOneConfirmed,
        hasPlayerTwoConfirmed: pact.hasPlayerTwoConfirmed,
        playerOneMsg: pact.playerOneMsg,
        playerTwoMsg: pactMessage,
      })
    } catch (err) {
      console.error(err)
    }
  })
  socket.on("pact:ready", async (payload) => {
    const { email, pactId } = payload
    console.log("Got", email, pactId)
    try {
      // Get the current player
      await connectToDatabase()
      const player = await User.findOne({ email })

      // Get the pact to join and add the new player
      const pact = await Pact.findById(pactId).populate('players')
      const isFirstPlayer = pact.players.findIndex(p => p.id === player.id) === 0 ?? 1
      if (isFirstPlayer) {
        pact.hasPlayerOneConfirmed = !pact.hasPlayerOneConfirmed
      } else {
        pact.hasPlayerTwoConfirmed = !pact.hasPlayerTwoConfirmed
      }

      // Save updates and reflect in socket
      console.log(pact)
      await pact.save()
      
      // Emit to the players
      io.to(pact.id).emit("pact:ready", {
        players: pact.players,
        pactId: pact.id,
        hasPlayerOneConfirmed: pact.hasPlayerOneConfirmed,
        hasPlayerTwoConfirmed: pact.hasPlayerTwoConfirmed,
        playerOneMsg: pact.playerOneMsg,
        playerTwoMsg: pact.playerTwoMsg,
      })

      // TODO: Check if both are ready, if so, emit event to set a pact in progress
    } catch (err) {
      console.error(err)
    }
  })
  socket.on("pact:leave", () => {
    console.log("pact:leave")
  })
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})