
const { statuscode, message, catchcode } = require("../../../statuscode")
const like = require("../../Model/user/like")
const videos = require("../../Model/user/videos")


// like video
const likevideo = async(req,res)=>{
    try {
        const {videoid}= req.body
        const{_id}= req.user
        const available = await videos.findById(videoid)
        if (available) {
            const likeexist = await like.findOne({ $and: [{ userid: _id }, { videoid: videoid }] });
            if (likeexist) {
                return res.send({
                    message:"you are already like this video",
                    success:false,
                    data:likeexist
                })
                
            } else {
                const data = await like.create({
                    like:"true",
                    userid:_id,
                    videoid:videoid
                })
                return res.send({
                    message:`you are like this video`,
                    success: true,
                    status:statuscode.OK,
                    data:data
                })
            }
            
        } else {
            return res.send({
                message :"This video is unavailable",
                success:true,
                status : statuscode.NOT_FOUND
            })
        }
    } catch (error) {
        console.log(error)
        return res.send(catchcode)
    }
}
// unlike video 
const unlikevideo  = async(req,res)=>{
    try {
        const {videoid}= req.body
        const {_id}=req.user
        const data = await like.findOneAndDelete({$and:[{videoid:videoid},{ userid:_id}]})
        return res.send({
            message : "you are unlike this video ",
            success:true,
            status:statuscode.OK,
            data:data
        })
    } catch (error) {
        console.log(error)
        return res.send(catchcode)
    }
}
// total like 
const likelist = async(req,res)=>{
    try {
        const likelist = await like.find({videoid:req.body.videoid})
        return res.send({
            message:"total like list successfully fetched",
            success:true,
            status:statuscode.OK,
            totallike: likelist.length,
            data:likelist

        })
    } catch (error) {
console.log(error)
        return res.send(catchcode)
    }
}
module.exports= {likevideo, unlikevideo,likelist}