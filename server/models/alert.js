import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  message: String,
});

const Alert = mongoose.model('Alert', alertSchema);

export default Alert
