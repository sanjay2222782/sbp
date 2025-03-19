const User = require("../../Model/user/user")
const jwt = require("jsonwebtoken");
const bcrypt= require("bcryptjs");
const { generateOTP, sendOTPEmail } = require("../../verifey/otpHelper");
const { catchcode, statuscode } = require("../../../statuscode");
// const { generateOTP, sendOTPEmail,verifyOTP} = require("../../verifey/otpHelper");


// signup
const signup = async (req, res) => {
  try {
    const { name, email, password, confirm, phone, counteryCode} = req.body;

    if (!name || !email || !password || !confirm || !phone ) {
      return res.status(400).send({
        success: 0,
        message: "Please fill all the required details",
      });
    }

    if (password !== confirm) {
      return res.status(400).send({
        success: 0,
        message: "Password and Confirm Password do not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: 0,
        message: "User with this email already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hash,
      phone,
      counteryCode,
      
    });

    
    return res.send({
      status:statuscode.CREATED,
      success: 1,
      message: "Your account has been created successfully",
      details: newUser,
    });

  } catch (error) {
    console.log(error)
    return res.send(catchcode);
  }
};

// login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        status:statuscode.NOT_FOUND,
        message: "User does not exist. Please sign up first.",
        success: false,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.send({
        status:statuscode.BAD_REQUEST,
        message: "Incorrect password",
        success: false,
      });
    }

    const payload = {
      email: req.body.email,
      time: Date.now(),
    };
    
    const token = await jwt.sign(payload, process.env.JWT_SECRET);

    // ✅ Use `User` model instead of `schema`
    const loggedUser = await User.findOneAndUpdate(
      { email: user.email },
      { token: token },
      { new: true }
    );

    return res.send({
      status:statuscode.OK,
      message: "Login successful",
      success: true,
      data: loggedUser,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.send(catchcode);
  }
};
// google login 

// forgot password
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.send({ status:statuscode.BAD_REQUEST, success: 0, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({status:statuscode.BAD_REQUEST, success: 0, message: "User not found" });
    }
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(email, otp);

    res.send({
      status:statuscode.OK,
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    res.send(catchcode);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmNewPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmNewPassword) {
      return res.send({status:statuscode.BAD_REQUEST, success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.send({status:statuscode.BAD_REQUEST, success: 0, message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.send({status:statuscode.NOT_FOUND, success: 0, message: "User not found" });
    }

    // Validate OTP from database
    if (user.otp !== otp) {
      return res.send({status:statuscode.BAD_REQUEST, success: 0, message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (user.otpExpires < new Date()) {
      return res.send({status:statuscode.BAD_REQUEST, success: 0, message: "OTP has expired" });
    }

    // Hash the new password
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.otp = null;  // Clear OTP after use
    user.otpExpires = null;
    await user.save();

    res.send({
      status:statuscode.OK,
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    res.send(catchcode);
  }
};
// add videocat update user details 
const userdetails= async(req,res)=>{
 try {
  const { email, videocat } = req.body;
  const data = await User.findOneAndUpdate(
    { email },
    { $set: { videocat: videocat } },
    { new: true, upsert: true }
);
  return res.send({
    status:statuscode.OK,
    messasge : "data succefully update ", success: true , data:data
  })
 } catch (error) {
  console.log(error)
  return res.send(catchcode)
 }
}
  
// list of recomended user 
const recomendeduser = async(req,res)=>{
try {
  const data = await User.find({videocat:req.body.videocat})
  return res.send({
    status:statuscode.OK,
    message:"recomended user  list successfully fetched",
    success : true ,
    data:data
  })
} catch (error) {
  console.log(error)
  return res.send(catchcode)
}
}




module.exports = { signup ,login,forgetPassword,resetPassword, userdetails, recomendeduser};

