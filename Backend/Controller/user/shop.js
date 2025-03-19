
const shop = require("../../Model/user/shop");
const fs = require("fs"); // File system module for file deletion
const path = require("path");
const { catchcode } = require("../../../statuscode");
// create shop
const createshop = async(req,res)=>{
    try {
        const exist = await shop.findOne({businesname:req.body.businesname})
        if(exist){
            return res.send({
                message:"this shop name is already exist please change business name",
                success: false,
                status:statuscode.BAD_REQUEST,
            })
        }
        const data = await shop.create({
            businesname :  req.body.businesname,
            categories:req.body.categories,
            userid:req.user.id,
            verify: "pending"
        })
        return res.send({
            message : "shop is succefully aplied ",
            success : true,
            status: statuscode.CREATED,
            data : data 
        })
    } catch (error) {
        console.log(error);
        return res.send(catchcode)
        
    }
}
// update shop data

const shoppicture = async (req, res) => {
    try {
        const { id, ...otherFields } = req.body;
        const exist = await shop.findById(id); // Check if shop exists

        if (!exist) {
            return res.status(404).send({
                success: false,
                message: "This shop is not found",
                status: statuscode.NOT_FOUND
            });
        }

        let updatedPicture = exist.shoppicture; // Default: keep old picture

        if (req.file) {
            const newImagePath = `/uploads/user/shopimage/${req.file.filename}`;

            if (exist.shoppicture) {
                // 🛠 Get old image path (Absolute Path)
                const oldImagePath = path.join(__dirname, "../../", exist.shoppicture);

                if (fs.existsSync(oldImagePath)) {
                    try {
                        fs.unlinkSync(oldImagePath);
                        console.log("✅ Old image deleted:", oldImagePath);
                    } catch (err) {
                        console.error("⚠️ Error deleting old image:", err);
                    }
                }
            }

            updatedPicture = newImagePath; // Set new image path
        }

        // Prepare update object
        const updateData = {
            ...otherFields, 
            shoppicture: updatedPicture
        };

   

        // Update shop details
        const updatedShop = await shop.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).send({
            message: "Shop details updated successfully",
            success: true,
            status: statuscode.OK,
            data: updatedShop
        });

    } catch (error) {
        console.error("❌ Error in shoppicture:", error);
        return res.send(catchcode);
    }
};


module.exports= { createshop ,shoppicture}