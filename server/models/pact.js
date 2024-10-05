const mongoose = require('mongoose');

const pactSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  hasPlayerOneConfirmed: Boolean,
  hasPlayerTwoConfirmed: Boolean,
  state: {
    type: String,
    enum: ['open', 'closed', 'in-progress'],
    default: 'open',
  },
  createdAt: { type: Date, default: Date.now },
});

const Pact = mongoose.model('Pact', pactSchema);

export default Pact;
