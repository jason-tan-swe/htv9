
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Boolean,
  relationships: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Relationship' }
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
