const { Schema, model } = require("mongoose");


const admindetails = new Schema({
    name:{type:String}, 
    email:{type:String}, 
    password:{type:String}, 
    token:{type:String}, 
    phone:{type:Number}, 
},{
    timestamps: true
})
module.exports= model("admindetails", admindetails)