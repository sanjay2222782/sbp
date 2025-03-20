const { Router } = require("express");
const { createshop, shoppicture } = require("../../Controller/user/shop");
const multer = require("multer")
const path= require("path");
const shoprouter = Router()
const shoppath = path.join(__dirname,("../../uploads/user/shopimage"))

const storage = multer.diskStorage({
    destination:  (req, file, cb) =>{
        cb(null, shoppath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const fileFilter1 = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type! Only JPG & PNG allowed."), false);
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter1
});
shoprouter.post("/createshop", createshop)
shoprouter.put("/updateshop", upload.single("shoppicture"), shoppicture);
module.exports= {shoprouter}