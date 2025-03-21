const User = require("../../Model/user/user")
const jwt = require("jsonwebtoken");
const bcrypt= require("bcryptjs");
const { generateOTP, sendOTPEmail } = require("../../verifey/otpHelper");
const { catchcode, statuscode } = require("../../../statuscode");
// const { generateOTP, sendOTPEmail,verifyOTP} = require("../../verifey/otpHelper");
const speakeasy = require("speakeasy");

// signup and google
// method: post
//endpoint - /user/register
const signup = async (req, res) => {
  try {
    const { email, name, phone, countryCode, source, password, confirmPassword } = req.body;

    // Validate required fields
    if (!email || !name) {
      return res.status(400).send({
        success: false,
        message: "Please fill all the required details",
      });
    }

    if (source === "google") {
      // Google signup process
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        // User exists: generate and return token
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
        return res.status(200).send({
          success: true,
          message: "User logged in successfully",
          token: token,
          user: existingUser,
        });
      } else {
        // User doesn't exist: create new user first without token
        const newUser = await User.create({
          name,
          email,
          phone,
          countryCode,
          source,
        });

        // Generate token for the newly created user
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
        // Save token in the database
        newUser.token = token;
        await newUser.save();

        return res.status(201).send({
          success: true,
          message: "Your account has been created successfully",
          token: token,
          user: newUser,
        });
      }
    } else {
      // Normal signup process: validate password fields
      if (!password || !confirmPassword) {
        return res.status(400).send({
          success: false,
          message: "Please provide both password and confirm password",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).send({
          success: false,
          message: "Password and Confirm Password do not match",
        });
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Hash the password before saving it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user without generating a token
      const newUser = await User.create({
        name,
        email,
        phone,
        countryCode,
        password: hashedPassword,
        source: "app",
      });

      return res.status(201).send({
        success: true,
        message: "Your account has been created successfully",
        user: newUser,
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};



// login user
// method: post
//endpoint - /user/login
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

//  generateOTP & send 
// method: patch
//endpoint - /user/forgetpassword
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

//  verifyUserOTP
// method: patch
//endpoint - /user/verifyotp
const verifyUserOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).send({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Log for debugging: Ensure OTP and expiration are correct
    console.log("User OTP:", user.otp);
    console.log("User OTP Expiry:", user.otpExpires);
    console.log("Provided OTP:", otp);
    console.log("Current Date:", new Date());

    // Check if OTP exists and verify it
    if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).send({ success: false, message: "OTP has expired or is invalid" });
    }

    // Verify OTP with the stored secret
    const isValidOTP = speakeasy.totp.verify({
      secret: process.env.OTP_SECRET_KEY,  // Secret stored in .env
      encoding: "base32",
      token: otp,
      window: 2,  // Increased window size to 2 steps for leniency
    });

    if (!isValidOTP) {
      return res.status(400).send({ success: false, message: "Invalid OTP" });
    }

    return res.status(200).send({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
};

//  resetpassword otp
// method: patch
//endpoint - /user/resetpassword
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;

    if (!email ||  !newPassword || !confirmNewPassword) {
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

// video cat selet by user 
// method: put
//endpoint - /user/update
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
  
// list of recomended user select by user  
// method: post
//endpoint - /user/recomenduser
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




module.exports = { signup ,login,forgetPassword,resetPassword,verifyUserOTP, userdetails, recomendeduser};

