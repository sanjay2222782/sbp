
const { statuscode, message, catchcode } = require("../../../statuscode");
const comment = require("../../Model/user/comment");
const videos = require("../../Model/user/videos");


// comment on video 
const   videocomment = async( req,res)=>{
    try {
        const {videoid} = req.body
        const {_id} = req.user
        const exist = await videos.findById(videoid)
        if (exist) {
            const data = await comment.create({
                comment:req.body.comment,
                videoid:videoid,
                userid:_id
            })
          return res.send({
            message:"you comment on this post ",
            success : true, 
            status: statuscode.CREATED,
            data:data
          })  
        } else {
            return res.send({
                message :"this video is unavailable",
                success: false,
                status:statuscode.BAD_REQUEST,

            })
        }
    } catch (error) {
        console.log(error.message);
        
        return res.send(catchcode)
    }
}

// delete comment 
const deletecomment = async(req,res)=>{
try {
    const {id} = req.body
    const userown = await comment.find({userid:req.user._id})
    if (userown) {
        const data = await comment.findByIdAndDelete(id , {new :true})
        return res.send({
            message :"comment successfully deleted",
            success: true, 
            status: statuscode.OK,
            data:data
        })
    } else {
        return res.send({
            message :"you are not do any comment",
            success: false, 
            status: statuscode.BAD_REQUEST,
        })
    }

} catch (error) {
    console.log(error.message);
        
        return res.send(catchcode)
}
}
module.exports= { videocomment ,deletecomment}