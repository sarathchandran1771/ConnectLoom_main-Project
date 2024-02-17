const express = require("express");
const router = express.Router();
const Friendrequest = require("../../models/FollowersSchema");
const User = require("../../models/userSchema");
const { json } = require("body-parser");

// POST endpoint to send a friend request

const sendRequest = async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    // Check if the target user is blocked
    const toUser = await User.findById(toUserId);
    if (toUser.restrict) { 
      return res.status(400).json({ message: "Target user is blocked." });
    }

    // Find and delete any existing friend request
    const existingRequest = await Friendrequest.findOneAndDelete({
      $or: [
        { fromUser: fromUserId, toUser: toUserId },
        { fromUser: toUserId, toUser: fromUserId },
      ],  
    }); 
  
    if (existingRequest !== null) {
      // Delete data from users
      console.log(" existingRequest  toUserId", toUserId);   
      console.log("existingRequest   fromUserId", fromUserId);

      await User.findByIdAndUpdate( 
        fromUserId,
        {
          $pull: { following: toUserId, pendingFollowing: toUserId },
          $inc: { "account.followingCount": -1 },
        },
        { new: true }
      );

      await User.findByIdAndUpdate(   
        toUserId,
        {
          $pull: { followers: fromUserId, pendingFollowers: fromUserId },
          $inc: { "account.followersCount": -1 },
        },
        { new: true }
      );

      return res.status(200).json({ message: "Friend request canceled." });
    } else {
      // Add to following list
      const userUpdateResult = await User.findByIdAndUpdate(
        fromUserId,
        {
          $addToSet: { pendingFollowing: toUserId },
        },
        { new: true } // Ensure you get the updated document
      );

      const userUpdate = await User.findByIdAndUpdate(
        toUserId,
        {
          $addToSet: { pendingFollowers: fromUserId },
        },
        { new: true } // Ensure you get the updated document
      );

      const newRequest = new Friendrequest({
        fromUser: fromUserId,
        toUser: toUserId,
        acceptFollow: null,
      });

      await newRequest.save();
    }

    return res
      .status(200)
      .json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPendingRequest = async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.query;
    console.log("req.query",req.query)
    // Check if the target user is blocked
    const pendingRequest = await Friendrequest.findOne({
      fromUser: fromUserId,
      toUser: toUserId,
    });
    if (pendingRequest) {
      return res
        .status(200)
        .json({ message: "Pending friend request found.", pendingRequest });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const respondRequest = async (req, res) => {
  try {
    const { toUserId, fromUserId, accept } = req.body;
    // Find the friend request
    const friendRequest = await Friendrequest.findOne({
      fromUser: fromUserId,
      toUser: toUserId,
      $or: [{ acceptFollow: null }, { acceptFollow: undefined }],
    });
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }
    // Check if the friend request is still pending
    if (
      friendRequest.acceptFollow !== null &&
      friendRequest.acceptFollow !== undefined
    ) {
      return res
        .status(400)
        .json({ message: "Friend request already responded." });
    }

    // Update friend request based on the user's response
    friendRequest.acceptFollow = accept;

    if (friendRequest.acceptFollow) {
      await User.findByIdAndUpdate(toUserId, {
        $inc: { "account.followersCount": 1 },
        $addToSet: { followers: fromUserId },
        $pull: { pendingFollowers: fromUserId },
      });
      await User.findByIdAndUpdate(fromUserId, {
        $inc: { "account.followingCount": 1 },
        $addToSet: { following: toUserId },
        $pull: { pendingFollowing: toUserId },
      });
      await friendRequest.save();
    } else {
      await User.findByIdAndUpdate(fromUserId, {
        $pull: { pendingFollowing: toUserId },
      });

      await User.findByIdAndUpdate(toUserId, {
        $pull: { pendingFollowers: fromUserId },
      });

      // Remove the friendRequest document
      await Friendrequest.findOneAndDelete({
        $or: [
          { fromUser: fromUserId, toUser: toUserId },
          { fromUser: toUserId, toUser: fromUserId },
        ],
      });
    }
    return res.status(200).json({
      message: accept ? "Friend request accepted." : "Friend request declined.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const getFollowersList = async (req, res) => {
  try {
    const { userId } = req.params;
    // Check if the target user is blocked
    const userData = await User.find({_id:userId}).populate("followers")
    const data=userData[0].followers
    return res.status(200).json({ message: "Followers data List",data});
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getFollowingList = async (req, res) => {
  try {
    const { userId } = req.params;
    // Check if the target user is blocked
    const userData = await User.find({_id:userId}).populate("following")
    const data=userData[0].following
    return res.status(200).json({ message: "Following data List",data });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  sendRequest,
  respondRequest,
  getPendingRequest,
  getFollowersList,
  getFollowingList
};
