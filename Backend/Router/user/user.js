

const { Router } = require("express");
const { check } = require("express-validator");
const { login, signup, forgetPassword, resetPassword, userdetails, recomendeduser, verifyUserOTP } = require("../../Controller/user/user-register");


const publicrouter = Router();

// router of user-account 

publicrouter.post(
  "/register",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[@$!%*?&#]/)
      .withMessage("Password must contain at least one special character"),
  ],
  signup
);
publicrouter.post("/login", login)
publicrouter.patch("/forgetpassword",forgetPassword)
publicrouter.patch("/resetpassword",resetPassword)
publicrouter.patch("/verifyotp",verifyUserOTP)
publicrouter.put("/update",userdetails)
publicrouter.post("/recomenduser",recomendeduser)
module.exports = {
  publicrouter,
};
