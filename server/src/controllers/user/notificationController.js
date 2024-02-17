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

    let targetObjectId = null;
    let message = "";

    if (type === "comment") {
      const comment = await Comment.findById({ _id: target });
      if (comment) {
        targetObjectId = target;
        message = `New comment from ${initiator}`;
      } else { 
        console.log("canceling the request");
        // Handle the case where the comment is not found
      }
    } else if (type === "followRequest") {
      const friendRequest = await Friendrequest.findOne({ toUser: userId });
      if (friendRequest) {
        targetObjectId = friendRequest._id;
        message = `${initiator} sent you a friend request`;
      } else {
        console.log("canceling the request");
        // Handle the case where the friend request is not found
      }
    } else if (type === "like") {
      const likeNotify = await Likes.findOne({ user: initiator });
      if (likeNotify) {
        targetObjectId = likeNotify._id;
        message = `${initiator} liked your post`;
      } else {
        console.log("canceling the request");
        // Handle the case where the like notification is not found
      }
    } else if (type === "replyComment") {
      const replyOnComment = await ReplayComment.findOne({
        parentComment: initiator,
      });
      if (replyOnComment) {
        targetObjectId = replyOnComment._id;
        message = `New reply on your comment from ${initiator}`;
      } else {
        console.log("canceling the request");
        // Handle the case where the reply on comment is not found
      }
    } else if (type === "friendRequestAccept") {
      const acceptFriendRequest = await Friendrequest.findOne({
        toUser: initiator,
      });
      if (acceptFriendRequest) {
        targetObjectId = acceptFriendRequest._id;
        message = `${initiator} accepted your friend request`;
      } else {
        console.log("canceling the request");
        // Handle the case where the accepted friend request is not found
      }
    }
    // Create a new notification
    if (targetObjectId) {
      const notification = await Notification.create({
        user: user._id,
        type: type,
        target: targetObjectId,
        initiator: initiator,
      });
      res.status(201).json({ notification, message });
    } else {
      console.log("Unable to create notification: targetObjectId is null");
      res
        .status(400)
        .json({
          error: "Unable to create notification: targetObjectId is null",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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

const forwardNotifyPost = async (req, res) => {
  try {
    const notificationId = req.params.notifyId;
    // Update the notification to mark it as read
    const notifyData = await Notification.findById({_id:notificationId});

    if(notifyData.type === "comment"){
      const commentData = await Comment.findOne({_id:notifyData.target}).populate('user')
      res.status(200).json({ message: 'comment Data' ,commentData });
    }else if(notifyData.type === "friendRequestAccept"){
      const FriendrequestData = await Friendrequest.findOne({_id:notifyData.target})
      const toUserData = await User.findById({_id:FriendrequestData.toUser});
      res.status(200).json({ message: 'Friendrequest Data' ,toUserData });
    }else if(notifyData.type === "like"){
      const commentData = await Likes.findOne({_id:notifyData.target}).populate('post')
      res.status(200).json({ message: 'Liked Data',commentData });
    }else if(notifyData.type === "replyComment"){
      const replyCommentData = await ReplayComment.findOne({_id:notifyData.target})
      res.status(200).json({ message: 'replyComment Data' ,replyCommentData });
    }
    //res.status(200).json({ message: 'Notification marked as read',notifyData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
    createNotification,
    getUnreadNotifications,
    markNotificationAsRead,
    forwardNotifyPost
};
