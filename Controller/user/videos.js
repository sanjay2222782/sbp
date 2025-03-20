
const { statuscode, catchcode } = require("../../../statuscode");
const User = require("../../Model/user/user")
const videos = require("../../Model/user/videos")

const uploadvideo = async(req,res)=>{
    try {
        id = req.user?._id;
        const exist = await User.findById(id)
        if (exist) {
            const data = await videos.create({video:`/uploads/user/uservideos/${req.file.filename}`,
                userid:id
            })
            return res.send({
                message :"video successfully uploaded",
                success: true, 
                status:statuscode.CREATED,
                data:data

            })
        } else {
            return res.send({
                
                message: "user does not exist",
                 success: false , 
                 status: statuscode.NOT_FOUND
            })
        }

    } catch (error) {
        console.log(error.message)
        return res.send(catchcode)
    }
}
// view video
const viewVideo = async (req, res) => {
    try {
        const { videoid } = req.body; // Video ID from request
        const { _id } = req.user; // Logged-in user ID

        // Check if video exists
        const videofind = await videos.findById(videoid);
        if (!videofind) {
            return res.send({
                message: "This video does not exist",
                success: false,
                status: statuscode.NOT_FOUND
            });
        }

        // Check if user has already viewed this video
        const alreadyViewed = videofind.views.includes(_id);
        if (alreadyViewed) {
            return res.send({
                message: "You have already viewed this video",
                success: false,
                data: videofind
            });
        }

        // Add user ID to views list and increment view count
        videofind.views.push(_id);
        videofind.viewCount += 1; // Increment view count
        await videofind.save(); // Save updated video document

        return res.send({
            message: "Video viewed successfully",
            success: true,
            status: statuscode.OK,
            data: videofind
        });

    } catch (error) {
        console.error("View Video Error:", error);
        return res.send(catchcode);
    }
};


module.exports= { uploadvideo ,viewVideo}