const express = require('express');
const Friendrequest = require('../../models/FollowersSchema');
const User = require("../../models/userSchema");
const Notification = require('../../models/NotificationSchema');
const Comment = require("../../models/commentSchema/commentSchema");
const Likes = require("../../models/likesSchema");
const ReplayComment = require("../../models/commentSchema/repliesSchema");


// Controller to create a notification
const createNotification = async (req, res) => {
    try {
      const { userId, type, target, initiator } = req.body;
      console.log("req.body",req.body)

      const user = await User.findById(userId);
      console.log("user",user)

    let targetObjectId = null;
    let message = '';

    if (type === 'comment') {
      const comment = await Comment.findOne({ user: initiator });
      targetObjectId = comment._id;
      message = `New comment from ${initiator}`;
    } else if (type === 'followRequest') {
      const friendRequest = await Friendrequest.findOne({ toUser: userId });
      targetObjectId = friendRequest._id;
      message = `${initiator} sent you a friend request`;
    } else if (type === 'like') {
      const likeNotify = await Likes.findOne({ user: initiator });
      targetObjectId = likeNotify._id;
      message = `${initiator} liked your post`;
    } else if (type === 'replyComment') {
      const replyOnComment = await ReplayComment.findOne({ parentComment: initiator });
      targetObjectId = replyOnComment._id;
      message = `New reply on your comment from ${initiator}`;
    } else if (type === 'friendRequestAccept') {
      const acceptFriendRequest = await Friendrequest.findOne({ toUser: initiator });
      targetObjectId = acceptFriendRequest._id;
      message = `${initiator} accepted your friend request`;
    }
  
      // Create a new notification
      const notification = await Notification.create({
        user:user._id,
        type:type,
        target: targetObjectId,
        initiator:initiator,
      });
  console.log("notification",notification)
      res.status(201).json({ notification,message  });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getUnreadNotifications = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Fetch unread notifications for the user
      const notifications = await Notification.find({ user: userId, isRead: false })
        .sort({ createdAt: -1 }) 
        .populate('initiator');
  
      const initiatorIds = notifications.map(notification => (notification.initiator ? notification.initiator._id : null));
      const initiators = await User.find({ _id: { $in: initiatorIds } });
      const initiatorMap = new Map(initiators.map(user => [user._id.toString(), user]));
      const notificationsWithUserData = notifications.map(notification => ({
        ...notification.toObject(),
        initiator: notification.initiator ? initiatorMap.get(notification.initiator._id.toString()) : null,
      }));
      res.status(200).json({ notifications: notificationsWithUserData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// Controller to mark a notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    // Update the notification to mark it as read
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
    createNotification,
    getUnreadNotifications,
    markNotificationAsRead
};
