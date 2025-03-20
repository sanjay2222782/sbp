const jwt = require("jsonwebtoken")
const User = require("../Model/user/user")
const { model } = require("mongoose")

const genertaeMiddleware = (model) =>async(req,res,next)=>{
    try {
         req.headers.token
        const token = req.headers.token
        const decode =await  jwt.verify(token,process.env.JWT_SECRET)
        
        

        const user = await model.findOne({email:decode.email})
        req.user= user
       
        next()
    } catch (error) {
        console.log(error.message)
        return res.send({
            success:0,
            Message:error.Message
        })
    }
}
     const userMiddleware = genertaeMiddleware(User)
   
  
module.exports = {
    
    userMiddleware
}