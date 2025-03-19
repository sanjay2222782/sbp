const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const { addvideocat, getvideocat } = require("../../Controller/admin/videoCat");
const verifyshop = require("../../Controller/admin/shop");

const videocatrouter = Router();

// ✅ Define Upload Paths
const avatarPath = path.join(__dirname, "../../uploads/admin/videocat");
const subavtaarPath = path.join(__dirname, "../../uploads/admin/subcat");



// ✅ Multer Storage for Video Categories
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


const substorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, subavtaarPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ✅ File Filter (Only Allow JPG & PNG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type! Only JPG & PNG allowed."), false);
  }
};

// ✅ Initialize Multer Uploads
const upload = multer({ storage, fileFilter });
const subupload = multer({ storage: substorage, fileFilter });

// ✅ API Endpoints
videocatrouter.post("/videocat", upload.single("avtaar"), addvideocat);

videocatrouter.get("/videocat",  getvideocat);
videocatrouter.put("/verify",  verifyshop);



module.exports = videocatrouter;
