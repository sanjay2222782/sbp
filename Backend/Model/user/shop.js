const { Schema, model } = require("mongoose");
const {ObjectId} = require("mongodb")
const shop = new Schema({
    businesname:{type:String},
    userid:{type:ObjectId, ref:"user"},
    categories:{type:String},
    shoppicture:{type:String ,default:""},
    verify:{type:String},
})
module.exports= model("shop",shop)
