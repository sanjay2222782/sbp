const {Router}= require("express")
const { videocomment, deletecomment } = require("../../Controller/user/comment")


const commentrouter = Router()

commentrouter.post("/comment", videocomment)
commentrouter.delete("/deletecomment", deletecomment)
module.exports ={commentrouter}