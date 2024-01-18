// server/src/controllers/post/postControllers.js
const express = require("express");
const postRouter = express.Router();
const corsManage = require("../../../shared/utilities/corsManage");
const {
  cloudinaryConfig,
} = require("../../../shared/config/cloudinaryConfig.js");
const { generateSignature } = require("../../middleware/cloudinaryMiddleware");
const Post = require("../../models/postSchema");
const User = require("../../models/userSchema");
const dotenv = require("dotenv");

dotenv.config();

postRouter.use(corsManage);
cloudinaryConfig();

const postNewDataPosting = async (req, res) => {
  const { description, isDelete, comments } = req.body;

  // const imageID = req.body.cloudinaryData.url;
  const imageID = req.body.cloudinaryData.map((data) => data.url);

  try {
    const userinfo = JSON.parse(req.body.userinfo);

    const userId = userinfo._id;

    const isReport = false;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    const cloudinaryData = generateSignature;

    const post = await Post.create({
      user: userId,
      image: imageID,
      description: description,
      isReport: isReport,
      isDelete: isDelete,
      comments: comments,
    });
    res.status(200).json(post);
  } catch (error) {
    console.error("Internal_post_error", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getDataPostedOnprofile = async (req, res) => {
  try {
    const usersId = req.params.userID;
    const post = await Post.find({
      user: usersId,
      isReport: false,
      archived: true,
})      .populate("user")
      .select("-password");

      if (!post || post.length === 0) {
        console.log("Posts not found");
      return res.status(200).json({ message: "Posts not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Internal_get_error", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isReport: { $ne: true }, reportCount: { $lt: 5 }, archived: { $ne: true }  })
      .populate("user") 
      .select("-password");
    if (!posts || posts.length === 0) {
      return res.status(200).json({ message: "Posts not found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error("Internal_get_error", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Check if the post exists
    const post = await Post.findById(postId);
    const user = await User.findById(post.user._id);
    console.log("user", user);

    console.log("post details from delete post", post);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== user._id.toString()) {
      console.log("both the ID are not matching");
      return res.status(403).json({ message: "Permission denied" });
    }

    // Delete the post
    await Post.deleteOne({ _id: postId });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Internal_delete_error", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const reportPost = async (req, res) => {
  try {
    
    const { postId } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      console.log("Post not found for reporting");
      return res.status(404).json({ error: "Post not found" });
    }

    post.reportCount += 1;

    if (post.reportCount >= 5) {
      post.isReport = true;
    }
    // Save the updated post
    const updatedPost = await post.save();
    console.log("updatedPost",updatedPost);
    return res.status(200).json({ message: "Post reported successfully", updatedPost });
  } catch (error) {
    console.error("Error reporting post", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const archivePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    // Check if the post exists
    const post = await Post.findById(postId);
    const user = await User.findById(post.user._id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== user._id.toString()) {
      console.log("both the ID are not matching");
      return res.status(403).json({ message: "Permission denied" });
    }
    // Toggle the value of the 'archived' field
    const updatedPost = await Post.updateOne(
      { _id: postId },
      { $set: { archived: !post.archived } } 
    );

    res.status(200).json({ message: "Post archived successfully" });
  } catch (error) {
    console.error("Internal_archive_error", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


module.exports = { 
  postNewDataPosting, 
  getDataPostedOnprofile,
   deletePost,
   reportPost,
   getAllPosts,
   archivePost
  };
