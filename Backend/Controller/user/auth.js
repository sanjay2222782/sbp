
const { statuscode, catchcode } = require("../../../statuscode")
const User = require("../../Model/user/user")
const fs = require("fs");
const path = require("path");

// user follow 
const follow = async(req,res)=>{
    try {
      const {userid}= req.body
     const newuser = req.user
     
      
      const user1 =await User.findById(userid)
     if (user1) {
       const data1= await User.findByIdAndUpdate(newuser._id, { $addToSet: { following: userid } }, { new: true });
      
        return res.send({
            message: `you follow ${user1.name}`,
            success: true,
            status:statuscode.OK,
data1: data1,

        })
     } else {
      return res.send({
        message : "user does not exist " ,
        success : false,
        status:statuscode.BAD_REQUEST
      })
     }
    } catch (error) {
      console.log(error)
    return res.send(catchcode)
    }
  }
  // user unfollow
  const unfollow = async(req,res)=>{
    try {
      const {userid}= req.body
const existuser = req.user
const data1 =  await User.findByIdAndUpdate(existuser._id,{$pull:{following:userid}},{new:true})

 return res.send({
  message : `you unfollow `,
  success: true,
  data:data1,
 
})
      
    } catch (error) {
      console.log(error)
      return res.send(catchcode)
    }
  }
// get follower list
const followers = async(req,res)=>{
  try {
    const data = await User.find({following:req.user._id})
return res.send({message: "list success fully get ",
  success : true , 
  data :data
})
  } catch (error) {
    console.log(error)
    return res.send(catchcode)
  }
}

// get following list 
const following = async(req,res)=>{
  try {
    const data = req.user.following
    const followingUsers = await User.find({ _id: { $in: data } });
  
return res.send({message: "list success fully get ",
  success : true , 
  data :followingUsers

})
  } catch (error) {
    return res.send(catchcode)
  }
}

const getProfile = async (req, res) => {
  try {
    // Debug: Check what is attached by middleware
    console.log("Decoded Token in req.user:", req.user);

    // Extract userId from decoded token payload
    const userId = req.user?.userId || req.user?.id; // Use whichever property is available
    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User id not provided",
      });
    }

    const data = await User.findById(userId);
    return res.status(200).send({
      message: "Get your Profile",
      success: true,
      status: statuscode.OK,
      data: data,
    });
  } catch (error) {
    console.error("Error in getProfile:", error.message);
    return res.send(catchcode);
  }
};


// Updated User Profile API
const updateuser = async (req, res) => {
    try {
        const { _id } = req.user;
        const existingUser = await User.findById(_id);

        if (!existingUser) {
            return res.status(404).send({
                message: "User not found",
                success: false,
                status: statuscode.NOT_FOUND
            });
        }

        let updatedProfilePicture = existingUser.profilepicture; // Default: keep old picture

        if (req.file) {
            const newImagePath = `/uploads/user/userprofilepic/${req.file.filename}`;

            // 🔥 Delete old profile picture if it exists
            if (existingUser.profilepicture) {
                const oldImagePath = path.join(__dirname, "../../", existingUser.profilepicture);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                   
                }
            }

            updatedProfilePicture = newImagePath; // Set new profile picture
        }

        // Prepare update object
        const updateData = {
            ...req.body,
            profilepicture: updatedProfilePicture
        };

        // Update user in DB
        const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });

        return res.status(200).send({
            message: "User updated successfully",
            success: true,
            status: statuscode.OK,
            data: updatedUser
        });

    } catch (error) {
        console.error("Error in updateuser:", error);
        return res.send(catchcode);
    }
};

// friend
const friendlist = async (req, res) => {
  try {
    const { _id } = req.user; // Token se logged-in user ki _id uthai
    const user = await User.findById(_id);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
        success: false,
        status: 400
      });
    }

   
    const followers = await User.find({ following: _id });

   
    const Friends = followers.filter(follower =>
      user.following.includes(follower._id)
    )
    // .map(follower => follower.name) // user kesirf name ki list show karne ke liye 


    return res.status(200).json({
      message: "Friends List get  successfully",
      success: true,
      status: 200,
      data: Friends
    });

  } catch (error) {
    console.log("Error:", error.message);
    return res.send(catchcode);
  }
};
// logout
const logout = async(req,res)=>{
  try {
    const {_id}= req.user
    const data = await User.findByIdAndUpdate(_id, {token:""}, {new:true})
    return res.send({
     message:`${data.name}, you have successfully logged out.`,
      success: true,
      status: statuscode.OK 
    })
  } catch (error) {
    console.log(error.message)
    return res.send(catchcode)
  }
}


  module.exports= {
    follow ,
     unfollow,
     followers ,
     following ,
     updateuser,
     friendlist,
     logout,
     getProfile
  }