const statuscode = require("../../../statuscode")
const shop = require("../../Model/user/shop")


const verifyshop  =async(req,res)=>{
try {
    const {id}=req.body
    const data = await shop.findByIdAndUpdate(id,{verify:"approved"},{new:true})
    return res.send({
        message:"shop approved successfully",
        status: statuscode.OK,
        success : true,
        data:data
    })
    
} catch (error) {
    console.log(error)
    return res.send({
        message:"SOmething went wrong",
        success: false,
        status : statuscode.INTERNAL_SERVER_ERROR,
    })
}

} 
module.exports= verifyshop