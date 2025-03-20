const { Schema, model } = require("mongoose")


const videoCat = new Schema({
    name:{type:String} ,
    avtaar:{type:String}
})
module.exports= model("videoCat",videoCat )