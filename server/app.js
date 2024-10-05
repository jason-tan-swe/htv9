import "dotenv/config"

import express from "express"
import { createServer } from "node:http"
import { Server } from "socket.io";
import cors from "cors"
import { connectToDatabase } from "./models/index.js";
import Alert from "./models/alert.js";
import User from "./models/user.js";

const app = express();

app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const port = 8080

/**
 * 1. Have rooms of two users through "friend code"
 * 2. Have users send "ready" messages
 * 
 */

io.on('connection', async (socket) => {
  console.log('a user connected');

  socket.on("pact:create", async (payload) => {
    console.log("pact:create")
    try {
      // Create a room in MongoDB with the current user
      await connectToDatabase()
      const alert = new Alert({
        message: "hello",
        id: 1
      })
      await alert.save()
      
      // Emit to the players
    } catch (err) {
      console.error(err)
    }
  })
  socket.on("pact:join", (payload) => {
    console.log("pact:join")
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