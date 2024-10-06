import mongoose from "mongoose";

const pactSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of two players
  hasPlayerOneConfirmed: { type: Boolean, default: false }, // For Lobby (confirmation)
  hasPlayerTwoConfirmed: { type: Boolean, default: false }, // For Lobby (confirmation)
  state: {
    type: String,
    enum: ['open', 'closed', 'in-progress'],
    default: 'open',
  },
  category: String,
  playerOneMsg: String,
  playerTwoMsg: String,
  playerOneTaskCompleted: { type: Boolean, default: false }, // Task completion status for Player 1
  playerTwoTaskCompleted: { type: Boolean, default: false }, // Task completion status for Player 2
  createdAt: { type: Date, default: Date.now },
  isComplete: { type: Boolean, default: false }, // Track whether the pact is complete
});

// Method to check if the pact is complete based on task completion status
pactSchema.methods.checkCompletion = function () {
  // Mark the pact as complete only if both players have completed their tasks
  if (this.playerOneTaskCompleted && this.playerTwoTaskCompleted) {
    this.state = 'closed';
    this.isComplete = true;
  } else {
    this.state = 'in-progress';
    this.isComplete = false;
  }
};

// Pre-save hook to update pact status based on task completion
pactSchema.pre('save', function (next) {
  this.checkCompletion();
  next();
});

const Pact = mongoose.model('Pact', pactSchema);

export default Pact;
