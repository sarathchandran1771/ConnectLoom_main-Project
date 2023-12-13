// controllers/user/userControllers.js
const express = require("express");
const cookieParser = require("cookie-parser");
const validator = require("validator");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const corsManage = require("../../../shared/utilities/corsManage");
const saltRounds = 10;
const dotenv = require("dotenv");
var nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const verifyToken = require("../../../shared/utilities/authToken");
const {
  sendVerificationEmail,
} = require("../../middleware/EmailIdVerification");
const {
  cloudinaryConfig,
} = require("../../../shared/config/cloudinaryConfig.js");
const { generateSignature } = require("../../middleware/cloudinaryMiddleware");
const { v4: uuidv4 } = require("uuid");
const generateUniqueToken = () => uuidv4();
const verificationToken = generateUniqueToken();
const User = require("../../models/userSchema");
// const ConnectLoom_Logo = require('../../../views/icons/ConnectLoom_Logo.png')
cloudinaryConfig();
dotenv.config();
userRouter.use(corsManage);



const postNewUserRegister = async (req, res) => {
  try {
    const {
      username,
      password,
      emailId,
      profilename,
      privatePublic,
      profilePic,
      Bio,
    } = req.body;
    if (!validator.isEmail(emailId)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    if (!username || !password || !emailId) {
      return res
        .status(400)
        .json({ error: "Username, password, and email are required fields" });
    }

    let userExists = await User.findOne({ emailId });
    if (userExists) {
      return res.status(400).json({ error: "Email ID already exists" });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const user = new User({
      username,
      password: hash,
      emailId,
      profilename,
      emailToken: verificationToken,
      Bio,
      privatePublic,
      profilePic
    });

    if (user) {
      await user.save();
      sendVerificationEmail(user);
    } else {
      console.log("Failed to create user");
      return res.status(500).json({ error: "Failed to create user" });
    }
  } catch (error) {
    console.error("Internal error 500", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const emailToken = req.body.emailToken;

    if (!emailToken) return res.status(404).json("EmailToken not found..");

    const user = await User.findOne({ emailToken });

    if (user) {
      user.emailToken = null;
      user.isVerified = true;

      await user.save();

      const token = verifyToken(res, user._id);

      console.log("Email verified successfully");
      res.status(200).json({
        _id: user._id,
        name: user.username,
        emailId: user.emailId,
        message: "User registered successfully",
        token: token,
        isVerified: user?.isVerified,
      });
    } else {
      console.error("User not found for verification");
      res.status(404).json("User not found for verification");
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json(error.message);
  }
};

const getNewRegisteredUser = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    const isPasswordMatch = await user.matchPassword(password);

    user.reportCount += 1;

    if (user.reportCount >= 5) {
      user.isVerified = false;
    }

    if (user && isPasswordMatch && user.isVerified == true) {
      const token = verifyToken(res, user._id);
      res.json({
        _id: user._id,
        username: user.username,
        emailId: user.emailId,
        profilename:user.profilename,
        Bio: user.Bio,
        privatePublic:user.privatePublic,
        profilePic:user.profilePic,
        token:token,
      });
      console.log("User logged in");
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Internal error 500", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const userForgetPassword = async (req, res) => {
//   try {
//     console.log("userForgetPassword");
//     const { emailId } = req.body;
//     const user = await User.findOne({ emailId: emailId });
//     console.log("reqest body", req.body);
//     console.log("user body", user);

//     if (!user) {
//       return res.send({ status: "User not exists" });
//     }
//     const token = verifyToken(res, user._id);

//     var transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.USER,
//         pass: process.env.PASS,
//       },
//     });

//     var mailOptions = {
//       from: process.env.USER,
//       to: emailId,
//       subject: "Reset your password",
//       text: `http://localhost:3000/resetPassword/${user._id}/${token}`,
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log("error from forget password", error);
//       } else {
//         console.log("Email sent: " + info.response);
//         return res.send({ status: "Success" });
//       }
//     });

//     res.send({ status: "Token sent successfully" });
//   } catch (error) {
//     console.error("Error in forgetPassword:", error);
//     res.status(500).send({ status: "Internal Server Error" });
//   }
// };

const userForgetPassword = async (req, res) => {
  try {
    console.log("userForgetPassword");
    const { emailId } = req.body;
    const user = await User.findOne({ emailId: emailId });
    console.log("reqest body", req.body);
    console.log("user body", user);

    if (!user) {
      return res.send({ status: "User not exists" });
    }
    const token = verifyToken(res, user._id);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const logoSrc = `${process.env.FRONTEND_BASEURL}/public/views/icons/ConnectLoom_Logo.png`;
    console.log("logoSrc",logoSrc)
    const mailOptions = {
      from: process.env.USER,
      to: emailId,
      subject: 'Reset Your ConnectLoom Password',
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; text-align: center; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
          <img src="${logoSrc}" alt="ConnectLoom Logo" style="max-width: 100px; margin-bottom: 20px;">
          <h2 style="color: #333;">Forgot Your Password?</h2>
          <p style="color: #555;">We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
          <p style="color: #555;">To reset your password, click on the link below:</p>
          <a href="${process.env.FRONTEND_BASEURL}/resetPassword/123/token"
             style="display: inline-block; background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Reset Password
          </a>
          <p style="color: #555; margin-top: 20px;">If the button above doesn't work, you can also click the link below:</p>
          <p style="color: #007BFF;">
            <a href="${process.env.FRONTEND_BASEURL}/resetPassword/123/token" style="color: #007BFF; text-decoration: none;">
              ${process.env.FRONTEND_BASEURL}/resetPassword/123/token
            </a>
          </p>
          <p style="color: #555;">Thank you for choosing ConnectLoom!</p>
        </div>
      `,
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error from forget password", error);
        return res.status(500).send({ status: "Internal Server Error" });
      } else {
        console.log("Email sent: " + info.response);
        return res.send({ status: "Success" });
      }
    });
    

    res.send({ status: "Token sent successfully" });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    res.status(500).send({ status: "Internal Server Error" });
  }
};




const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { confirmPassword } = req.body;
console.log("confirmPassword",confirmPassword)
  try {
    // Check if the user exists
    const user = await User.findById({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the token
    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);

    if (isTokenValid) {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(confirmPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: "Password reset successful" });
    } else {
      res.status(401).json({ message: "Token not verified" });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};

const uploadProfileImage = async (req, res) => {
  console.log('Request received at /uplaod-profileImage');
  try {
    const { userinfo } = req.body;
    console.log('req.body',req.body);
    console.log('req.bouserInfody',userinfo);

    const user = await User.findById(userinfo);
    const cloudinaryData = req.body.cloudinaryData; 

    if (!user) {
      console.log("User not found for updating");
      return res.status(404).json({ error: "User not found" });
    }
   
    if (user.isVerified === true) {
      // Assuming user.profilePic is an array, update accordingly
      const imageID = cloudinaryData.url;
      user.profilePic = imageID;

      const updatedUser = await user.save();

      console.log("User updated successfully", updatedUser);

      return res.status(200).json({ message: "Profile updated successfully", updatedUser });
    }
  } catch (error) {
    console.error("Error updating user", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  console.log("Logged out successfully");
  res.status(200).json({ message: "Logged out successfully" });
};



const OAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    const clientId = process.env.Client_ID;
    console.log("req.body", req.body);
    console.log("clientId", clientId);
    
    if (idToken) {
      const response = await authClient.verifyIdToken({
        idToken,
        audience: clientId,
      });
      const {
        isVerified: email_verified,
        emailId,
        username,
        profilePic,
      } = response.payload;

      if (email_verified) {
        const user = await User.findOne({ emailId }).exec();

        if (user) {
          return res.json(user);
        } else {
          // Assuming emailId is unique and required in the schema
          let password = emailId + clientId;
          console.log("password", password);

          const salt = bcrypt.genSaltSync(saltRounds);
          const hash = bcrypt.hashSync(password, salt);
          // Hash the password before saving it to the database

          let newUser = new User({
            emailId,
            username,
            profilePic,
            password: hash,
          });
          console.log("newUser", newUser);

          await newUser.save();

          const token = verifyToken(res, newUser._id);

          console.log("Email verified successfully");
          res.status(200).json({
            _id: newUser._id,
            name: newUser.username,
            emailId: newUser.emailId,
            message: "User registered successfully",
            token: token,
            isVerified: newUser?.isVerified,
          });
        }
      } else {
        res.status(400).json({ error: "Email not verified" });
      }
    } else {
      res.status(400).json({ error: "Missing idToken in the request body" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during authentication" });
  }
};

const reportUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      console.log("user not found for reporting");
      return res.status(404).json({ error: "user not found" });
    }

    user.reportCount += 1;

    if (user.reportCount >= 5) {
      user.isVerified = false;
    }

    const updatedUser = await user.save();

    console.log("user reported successfully");
    return res.status(200).json({message: "successfully reported",updatedUser});
  } catch (error) {
    console.error("Error reporting user", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { 
      userId,
      username,
      profilename,
      password,
      privatePublic,
      profilePic,
      Bio,
     } = req.body;
    
    const user = await User.findById({_id: userId});

    console.log("user for edit", user);

    if (!user) {
      console.log("User not found for updating");
      return res.status(404).json({ error: "User not found" });
    }
   
    if (user.isVerified === true) {
      // Hash the password
      if (password) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        console.log("hashedPassword",hashedPassword)
        user.password = hashedPassword;
      }
      // Update user fields
      user.username = username;
      user.profilename = profilename;
      user.privatePublic = privatePublic;
      user.profilePic = profilePic;
      user.Bio = Bio;

      // Save the updated user
      const updatedUser = await user.save();
      console.log("User updated successfully",updatedUser);
      return res.status(200).json({ message: "Profile updated successfully", updatedUser });
    }
  } catch (error) {
    console.error("Error updating user", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  verifyEmail,
  postNewUserRegister,
  getNewRegisteredUser,
  logoutUser,
  userForgetPassword,
  resetPassword,
  OAuth,
  reportUser,
  updateUser,
  uploadProfileImage
};
