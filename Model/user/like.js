const { Schema, model } = require("mongoose");
const {ObjectId} = require("mongodb")
const like = new Schema ({
    like:{type:String},
    videoid:{type:ObjectId, ref:"videoid"},
    userid:{type:ObjectId, ref:"userid"}
},{timestamps:true})
module.exports= model("likes",like)