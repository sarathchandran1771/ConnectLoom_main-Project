// server/src/controllers/post/postControllers.js
const express = require("express");
const postRouter = express.Router();
const corsManage = require("../../../shared/utilities/corsManage");
const Post = require("../../models/postSchema");
const User = require("../../models/userSchema");
const Comment = require("../../models/commentSchema/commentSchema");
const ReplyComment = require("../../models/commentSchema/repliesSchema");
const dotenv = require("dotenv");
const mongoose = require('mongoose');

dotenv.config();

postRouter.use(corsManage);

const commentOnPost = async (req, res) => {
    const { postId, userId, commentContent } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            console.log("Post does not exist from comment ");
            return res.status(200).json({ message: "Post does not exist from comment" });
        }
        const user = await User.findOne({ _id: userId, isVerified: true });
        if (!user) {
            console.log("User does not exist or is not verified");
            return res.status(404).json({ message: "User does not exist or is not verified" });
        }
        const newComment = new Comment({
            user: user._id,
            post: post._id,
            content: commentContent,
            initiator: user._id,
        });
        const savedComment = await newComment.save();
        post.comments.push(savedComment._id);
        await post.save();
        return res.status(200).json({ message: "Comment saved successfully", savedComment });
    } catch (error) {
        console.error("Error saving comment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
 
const getCommentsOnPost = async (req, res) => {
    const { postId, userId } = req.query;
    console.log("req.query from comments",req.query)

  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "Invalid postId" });
  }
    try {
        const comments = await Comment.find({ post: postId, user: userId }).populate('user', '-password');;

        if (!comments) {
            console.log("Comment does not exist");
            return res.status(404).json({ message: "Comment does not exist" });
        }  
        return res.status(200).json({ message: "Comment retrieved successfully", comments });
    } catch (error) {
        console.error("Error retrieving comment:", error); 
        return res.status(500).json({ error: "Internal Server Error" }); 
    }
};

const replayForComment = async (req, res) => { 
    const { commentId, userId, commentContent } = req.body;

    try {
        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            console.log("Parent comment does not exist");
            return res.status(200).json({ message: "Parent comment does not exist" });
        }

        const user = await User.findOne({ _id: userId, isVerified: true });
        if (!user) {
            console.log("User does not exist or is not verified");
            return res.status(200).json({ message: "User does not exist or is not verified" });
        }

        // Create a new Reply instance
        const reply = new ReplyComment({
            user: user._id,
            parentComment: parentComment._id,
            content: commentContent,
        });

        // Save the reply
        const savedReply = await reply.save();

        // Add the reply to the parent comment's replies array
        parentComment.replies.push(savedReply._id);

        // Save the updated parent comment
        await parentComment.save();

        console.log("Reply saved successfully:", savedReply);

        return res.status(200).json({ message: "Reply saved successfully", savedReply });
    } catch (error) {
        console.error("Error saving reply:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { 
    commentOnPost, 
    replayForComment,
    getCommentsOnPost
 };
