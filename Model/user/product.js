const { Schema, model } = require("mongoose");
const {ObjectId}=require("mongodb")
const product= Schema({
    name:{type:String},
    category:{type:String},
    subcategory:{type:String},
    shopid:{type:ObjectId, ref:"shop"},
    size:{type:String},
    color :{type:String},
    batchNo :{type:String},
    price :{type:Number},
    sellingprice :{type:Number},
    description :{type:String},
    title :{type:String},
    rating :{type:String},
    qnty :{type:Number},
    discount:{type:String},
    offerprice:{type:Number},
    images:[{type:String}],
    type:{type:String},
 
},{timestamps:true})
module.exports= model("products" , product)