import mongoose from "mongoose";

const pactSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  hasPlayerOneConfirmed: { type: Boolean, default: false },
  hasPlayerTwoConfirmed: { type: Boolean, default: false },
  state: {
    type: String,
    enum: ['open', 'closed', 'in-progress'],
    default: 'open',
  },
  createdAt: { type: Date, default: Date.now },
});

const Pact = mongoose.model('Pact', pactSchema);

export default Pact;
