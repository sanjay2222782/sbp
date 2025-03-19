const { Schema, model, default: mongoose } = require("mongoose");
const {ObjectId} = require("mongodb")
const schema = new Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
    counteryCode:{type:String},
    phone:{type:Number},
    gender:{type:String},
    token:{type:String},
    otp: { type: String },
    otpExpires: { type: Date },
    dob:{type:String},
    bio:{type:String},
    location:{type:String},
    diamond:{type:Number , default:0},
    profilepicture:{type:String},
    videocat: { type:ObjectId, ref: "videoCat" },
    follower: [{ type: ObjectId, ref: "user" }],
    following: [{ type: ObjectId, ref: "user" }],
    privetaccount:{type:String , default:"off"},
    dutevideo:{type:String , default:"everyone"},
    downloadvideo:{type:String , default:"on"},
    commentonvideo:{type:String , default:"everyone"},
    visibillity:{type:String , default:"everyone"}
} , {timestamps:true})
const User  = model("userdetails", schema)

module.exports = User