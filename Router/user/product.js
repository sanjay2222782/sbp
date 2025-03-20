const {Router}= require("express")
const multer = require("multer")
const path= require("path");
const { addproduct, updateproduct, catproduct, subcatproduct, cartproduct, addtocart, buyproduct } = require("../../Controller/user/products")

const productrouter = Router()
const productpath = path.join(__dirname, "../../uploads/user/product");
const product = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, productpath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// File filter to allow only images
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
    storage: product,
    fileFilter: fileFilter
});
productrouter.post("/add",uploads.array("images"),addproduct)
productrouter.post("/updateoffer", updateproduct)
productrouter.get("/catproduct", catproduct)
productrouter.get("/subcatproduct", subcatproduct)
productrouter.put("/cartproduct", cartproduct)
productrouter.post("/addcart", addtocart)
productrouter.post("/buyproduct", buyproduct)

module.exports ={productrouter}