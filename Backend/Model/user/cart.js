const { Schema } = require("mongoose");
const {ObjectId}= require("mongodb");
const { model } = require("mongoose");
const cart  = new Schema({
    userid:{type:ObjectId , ref:"user"},
    productid:[{type:ObjectId,ref:"product"}],
    qnty:{type:String},
    price:{type:Number}
    
})
module.exports= model("cart", cart)