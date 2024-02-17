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
const Advertisement = require('../../models/advertisementSchema')
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
});

const uploadPhoto = async (req, res) => {
  try {
    const imageUrl = `https://${process.env.S3_BUCKETNAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${req.file.key}`;
    const { adName, sponsored, description, fromDate, toDate } = req.body;
    console.log("req.body",req.body)
    console.log("imageUrl",imageUrl)
    const adUpload = await Advertisement.create({
      adImage:imageUrl,
      adName: adName,
      sponsored: sponsored,
      description:description,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      isDelete:false
    });
    return res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error'});
  }
};

const getUploadedAdToUser = async (req, res) => {
      try {
        const currentDate = new Date();
        const UploadedAds = await Advertisement.find({
          isDelete: { $ne: true },
          fromDate: { $lte: currentDate },
          toDate: { $gte: currentDate },
        });        
        res.status(200).json({UploadedAds})
      } catch (error) {
        console.error("Internal error 500", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
};


const getUploadedAdvertisement = async (req, res) => {
      try {
        const UploadedAds = await Advertisement.find({});
        console.log("UploadedAds",UploadedAds)
        res.status(200).json({UploadedAds})
      } catch (error) {
        console.error("Internal error 500", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
};

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
    res.status(200).json({ message: "Logged out" });
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
          console.log("reported Post not found");
          res.status(200).json({ message: "No reported posts available" });
        }
      } catch (error) {
        console.error("Internal error 500", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    };


    const getPremiumUsers = async (req, res) => {
      try {
        const users = await User.find({
          $and: [
            { paymentStatus: true },
            { isPremium: true }
          ]
        });
        res.status(200).json({users})
      } catch (error) {
        console.error("Internal error 500", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    };

    const deleteAdPost = async (req, res) => {
      try {
        const postId = req.params.postId;
        const adPosts = await Advertisement.find({_id:postId});

        await Advertisement.updateOne({ _id: postId }, { $set: { isDelete: !adPosts[0].isDelete } });

        const updatedAdPost = await Advertisement.findOne({ _id: postId });

        console.log("Updated Ad Post:", updatedAdPost);

       res.status(200).json({updatedAdPost})
      } catch (error) {
        console.error("Internal error 500", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
};

      const editAdPost = async (req, res) => { 
        try {
          console.log("req.body:", req.body);
          const imageUrl = `https://${process.env.S3_BUCKETNAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${req.file.key}`;
          const { postId, adName, sponsored, description, fromDate, toDate } = req.body;
          const updatedAdPost = await Advertisement.findByIdAndUpdate(
            { _id: postId },
            {
              adName: adName,
              sponsored: sponsored,
              description: description,
              fromDate: fromDate,
              toDate: toDate,
              adImage: imageUrl, 
            },
            { new: true }
          );
          console.log("Updated Ad Post:", updatedAdPost);
          const message='updatedSuccessfully'
          res.status(200).json({ updatedAdPost,message });
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
     getReportedPost,
     uploadPhoto,
     getUploadedAdToUser,
     getUploadedAdvertisement,
     getPremiumUsers,
     deleteAdPost,
     editAdPost
    }
