const mongoose = require("mongoose")
const videoCat = require("../../Model/admin/videoCat");
const User = require("../../Model/user/user");

const addvideocat = async(req,res)=>{
    try {
        const { name } = req.body;
        const avtaar = req.file ? `/uploads/admin/videocat/${req.file.filename}` : null;
        const exist = await videoCat.findOne({name:req.body.name})
        if (exist) {
            return res.send({
                message: "This videocategory is already exist ",
                success:false
            })
        } else {
            const data = await videoCat.create({
                name,
                avtaar,
              });
              return res.send({
                message: "videocategory sucessfully added",
                success:true, 
                data : data
            })
        }
    } catch (error) {
        console.log(error);
        
        return res.send({
            message: "something went wrong ",
            success:false
        })
    }
}
// get all video category 
const getvideocat = async(req,res)=>{
try {
    const data = await videoCat.find()
return res.send({
    message: "videocategory list successfully get ",
     success : true,
     data: data
})
} catch (error) {
    console.error("Error adding subcategory:", error);
        return res.status(500).json({
            message: "Something went wrong",
            success: false
        }); 
}    
}  



 module.exports= { addvideocat , getvideocat}