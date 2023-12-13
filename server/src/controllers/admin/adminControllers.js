// controllers/admin/adminControllers.js

const express = require('express');
const cookieParser = require('cookie-parser');
const adminRouter = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const corsManage = require("../../../shared/utilities/corsManage");
adminRouter.use(corsManage);
const User = require('../../models/userSchema')
const Post = require('../../models/postSchema')


const getAdminLogin = async (req, res) => {
    try {
      const { username, password } = req.body; 

      if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({ username: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
        console.log("admin logged in");
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error("Internal error 500", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  const AdminLogout = (req, res) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    console.log("Admin Logged out successfully");
    res.status(200).json({ message: "Logged out successfully" });
  };


  const getAllUsers = async (req, res) => {
      try {
        const user = await User.find({});
        res.status(200).json({user})
      } catch (error) {
        console.error("Internal error 500", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    };

    
    const updateUserStatus = async (req, res) => {
      try {
        const { userId } = req.body;
        const user = await User.findOne({ _id: userId });
    
        if (user) {
          // Toggle the isVerified status
          user.isVerified = !user.isVerified;
    
          await user.save();
    
          const statusMessage = user.isVerified
            ? "Your account is unblocked."
            : "Your account is blocked.";
    
          res.status(200).json({ user, message: statusMessage });
        } else {
          console.log("User not found");
          res.status(404).json({ error: "User not found" });
        }
      } catch (error) {
        console.error("Internal error 500", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    };
    
    const getReportedPost = async (req, res) => {
      try {
        const reportedPosts = await Post.aggregate([
          {
            $match: {
              $or: [
                { isReport: true },
                { reportCount: { $gte: 5 } }
              ]
            }
          }
        ]);
    
        if (reportedPosts.length > 0) {
          res.status(200).json({ reportedPosts });
        } else {
          console.log("No reported posts found");
          res.status(200).json({ message: "No reported posts available" });
        }
      } catch (error) {
        console.error("Internal error 500", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    };   

    const updatePostStatus = async (req, res) => {
      try {
        const { postId } = req.body;
        const post = await Post.findOne({ _id: postId });
        
        if (post) {
          post.isReport = !post.isReport;
          await post.save();
          console.log("Post status updated successfully");    
          res.status(200).json({ post });
        } else {
          console.log("Post not found");
          res.status(200).json({ message: "No reported posts available" });
        }
      } catch (error) {
        console.error("Internal error 500", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    };

  module.exports = { 
    getAdminLogin,
    AdminLogout,
     getAllUsers,
     updateUserStatus, 
     updatePostStatus,
     getReportedPost
    }
