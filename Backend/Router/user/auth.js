

const { Router } = require("express");
const { follow, unfollow, followers, following, updateuser, friendlist, logout, getProfile } = require("../../Controller/user/auth");
const { productrouter } = require("./product");
const { shoprouter } = require("./shop");
const { videorouter } = require("./video");
const path = require("path")
const multer = require("multer");
const { likelist, unlikevideo, likevideo } = require("../../Controller/user/like");
const { videocomment, deletecomment } = require("../../Controller/user/comment");
const authrouter = Router();

// user multer
const profilepath = path.join(__dirname,"../../uploads/user/userprofilepic")
const userprofile  = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, profilepath)
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now()+path.extname(file.originalname))
    }
    
}) 
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type! Only JPG & PNG allowed."), false);
    }
};

// Multer upload middleware (supports both single & multiple files)
const uploads = multer({
    storage: userprofile,
    fileFilter: fileFilter
});
// auth.js/
authrouter.post("/follow", follow)
authrouter.post("/unfollow", unfollow)
authrouter.get("/follower", followers)
authrouter.get("/following", following)
authrouter.put("/updateuser", uploads.single("profilepicture"),updateuser);
authrouter.get("/friends", friendlist);
authrouter.put("/logout", logout);
authrouter.get("/getprofile", getProfile)


//comment
authrouter.post("/comment", videocomment)
authrouter.delete("/deletecomment", deletecomment)
// shop router
authrouter.use("/shop", shoprouter)
//like router
authrouter.post("/likevideo", likevideo)
authrouter.delete("/unlike", unlikevideo)
authrouter.get("/likelist", likelist)

// product
authrouter.use("/product",productrouter);




module.exports = {
 authrouter
};
