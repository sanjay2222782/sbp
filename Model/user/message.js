const { model, Schema } = require("mongoose");
const {ObjectId}= require("mongodb")

const messageSchema = new Schema({
  sender: { type: ObjectId, ref: 'User', required: true },
  receiver: { type: ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = model('Message', messageSchema);
