import mongoose from "mongoose";

const pactSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of two players
  hasPlayerOneConfirmed: { type: Boolean, default: false },
  hasPlayerTwoConfirmed: { type: Boolean, default: false },
  state: {
    type: String,
    enum: ['open', 'closed', 'in-progress'],
    default: 'open',
  },
  playerOneMsg: String,
  playerTwoMsg: String,
  createdAt: { type: Date, default: Date.now },
  isComplete: { type: Boolean, default: false }, // Track whether the pact is complete
});

// Method to check if the pact is complete
pactSchema.methods.checkCompletion = function () {
  if (this.hasPlayerOneConfirmed && this.hasPlayerTwoConfirmed) {
    this.state = 'closed';
    this.isComplete = true;
  } else {
    this.state = 'in-progress';
  }
};

// Pre-save hook to update pact status
pactSchema.pre('save', function (next) {
  this.checkCompletion();
  next();
});

const Pact = mongoose.model('Pact', pactSchema);

export default Pact;
