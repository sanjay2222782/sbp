const { json } = require("express")
const {ObjectId}= require("mongodb")

const { model, Schema } = require("mongoose")

const comment = new Schema({
    comment:{type:String},
    videoid:{type:ObjectId, ref:"videoid"},
    userid:{type:ObjectId, ref:"userid"},
},{applyTimestamps:true})
module.exports= model("comments", comment)