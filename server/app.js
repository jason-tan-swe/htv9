import "dotenv/config"

import express from "express"
import { createServer } from "node:http"
import { Server } from "socket.io";
import cors from "cors"
import { connectToDatabase } from "./models/index.js";
import Alert from "./models/alert.js";
import User from "./models/user.js";
import Pact from "./models/pact.js";
import Relationship from "./models/relationship.js";

const app = express();
app.use(express.json());

app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

connectToDatabase();
const port = 8080

// Toggle completion status for a pact and update relationships
app.patch('/pact/:pactId/complete', async (req, res) => {
  console.log("Jason is completing")
  const { pactId } = req.params;
  const { userId } = req.body; // Get userId from the request body

  try {
    console.log(req.body);
    await connectToDatabase();
    
    
    
    // Find the pact and populate players
    const pact = await Pact.findById(pactId).populate('players');
    const playerOne = await User.findById(pact.players[0]._id);
    const playerTwo = await User.findById(pact.players[1]._id);

    if (!pact) {
      return res.status(404).json({ message: 'Pact not found' });
    }

    // Determine which player is confirming completion
    const isFirstPlayer = pact.players[0]._id.toString() === playerOne._id.toString();
    
    console.log(isFirstPlayer, pact.players[1]._id.toString(), pact.players[0]._id.toString(), userId, pactId)

    if (isFirstPlayer) {
      // Toggle Player One's confirmation status
      pact.playerOneTaskCompleted = true
    } else if (pact.players[1]._id.toString() === playerTwo._id.toString()) {
      // Toggle Player Two's confirmation status
      pact.playerTwoTaskCompleted = true;
    } else {
      return res.status(400).json({ message: 'User is not part of this pact' });
    }

    // If both players confirm, mark the pact as complete and handle relationships
    if (pact.playerOneTaskCompleted && pact.playerTwoTaskCompleted) {
      pact.isComplete = true;
      pact.state = 'closed';

      // Remove pact from both players' activePacts
      await User.updateMany(
        { _id: { $in: [playerOne._id, playerTwo._id] } },
        { $pull: { activePacts: pact._id } }
      );

      // Check if players are already friends (relationship exists)
      let relationship = await Relationship.findOne({
        $or: [
          { user1: playerOne._id, user2: playerTwo._id },
          { user1: playerTwo._id, user2: playerOne._id }
        ]
      });

      if (relationship) {
        // Increment the relationship score if they are already friends
        relationship.score += 10; // Example score increment, you can adjust as needed
        await relationship.save();
      } else {
        // Create a new relationship if they are not friends yet
        const newRelationship = new Relationship({
          user1: playerOne._id,
          user2: playerTwo._id,
          score: 10 // Initial score when a new friendship is formed
        });
        await newRelationship.save();
      }
    }

    // Save the updated pact
    await pact.save();

    // Respond with the updated pact
    res.status(200).json({
      pactId: pact._id,
      hasPlayerOneConfirmed: pact.hasPlayerOneConfirmed,
      hasPlayerTwoConfirmed: pact.hasPlayerTwoConfirmed,
      isComplete: pact.isComplete,
      state: pact.state,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/user/active-pacts/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).populate({
      path: 'activePacts',
      populate: {
        path: 'players',
        select: 'name email', // Only select the name and email fields
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ activePacts: user.activePacts });
  } catch (err) {
    console.error('Error fetching active pacts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


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
        isFirstPlayer,
      })

      console.log(pact.hasPlayerOneConfirmed, pact.hasPlayerTwoConfirmed)

      if (pact.hasPlayerOneConfirmed && pact.hasPlayerTwoConfirmed) {
        io.to(pact.id).emit("pact:inProgress", {
          status: "Pact is now in progress",
        })
        pact.state = "in-progress"
        
           // Add the pact to both players' activePacts
          const playerOne = pact.players[0];
          const playerTwo = pact.players[1];

          // Update the players' activePacts field
          await User.updateMany(
            { _id: { $in: [playerOne._id, playerTwo._id] } },
            { $addToSet: { activePacts: pact._id } } // Use $addToSet to avoid duplicates
          );

        await pact.save()
      }

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