const { statuscode } = require("../../../statuscode");
const adminDetails = require("../../Model/admin/adminDetails");
const bcrypt= require("bcryptjs");
// admin sign up 
const signup = async (req, res) => {
  try {
    const { name, email, password, confirm, phone, counteryCode} = req.body;

    if (!name || !email || !password || !confirm || !phone ) {
      return res.send({
        success: 0,
        message: "Please fill all the required details",
        status: statuscode.BAD_REQUEST
      });
    }

    if (password !== confirm) {
      return res.send({
        success: 0,
        message: "Password and Confirm Password do not match",
        status: statuscode.BAD_REQUEST
      });
    }

    const existingUser = await adminDetails.findOne({ email });
    if (existingUser) {
      return res.send({
        success: 0,
        message: "User with this email already exists",
        status: statuscode.BAD_REQUEST
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await adminDetails.create({
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

module.exports={
    signup,
}