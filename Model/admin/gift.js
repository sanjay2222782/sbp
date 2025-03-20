const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema({
    name: { type: String,  }, 
    gifUrl: { type: String, }, 
    price: { type: Number, }, 
    type: { type: String, enum: ["gif", "giphy"], } 
}, { timestamps: true });

module.exports = mongoose.model("Gift", giftSchema);
