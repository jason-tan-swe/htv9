
import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: Number,
  createdAt: { type: Date, default: Date.now }
});

const Relationship = mongoose.model('Relationship', relationshipSchema);

export default Relationship;
