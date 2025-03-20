const { Schema, model } = require("mongoose");
const {ObjectId}=require("mongodb")
const video = new Schema({
    category:{type:ObjectId,ref:"category"},
    video:{type:String},
    userid:{type:ObjectId, ref:"User"},
    views: { type: [Schema.Types.ObjectId], ref: "User" },
    viewCount: { type:Number, default: 0 },
},{timestamps:true})
module.exports= model("videos", video)
