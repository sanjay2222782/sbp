const { Router } = require("express");
const { uploadvideo, viewVideo } = require("../../Controller/user/videos");
const multer = require("multer")
const path= require("path");
const videorouter = Router()

const videospath = path.join(__dirname,("../../uploads/user/uservideos"))
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,videospath)
    }, 
    filename:(req,file,cb)=>{
        cb(null, `${Date.now()}${file.originalname}`)
    },
})
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/x-matroska", "video/quicktime", "video/x-msvideo"]; // MP4, MKV, MOV, AVI
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type! Only MP4, MKV, MOV & AVI allowed."), false);
    }
  };
 
const upload = multer({ storage, fileFilter });
videorouter.post("/uploadvideo",upload.single("video"), uploadvideo)
videorouter.get("/viewvideo", viewVideo)

module.exports={videorouter}