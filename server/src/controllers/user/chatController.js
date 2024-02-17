//controllers/chatControllers
const ChatMessage = require('../../models/chatSchema');
const ChatRoom = require('../../models/chatRoomSchema');
const User = require("../../models/userSchema");
const Post = require("../../models/postSchema.js")


const getUsersForChat = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({ _id: { $ne: userId },isVerified: true });
    if (users.length === 0) {
      return res.status(401).json({ message: 'User Not found' });
    }
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Internal error 500", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createRoomID = async (req, res) => {
  try {
    const { toUserId, fromUserId } = req.body;
    const existingChatRoom = await ChatRoom.findOne({
      userIds: { $all: [fromUserId, toUserId] }
    });

    if (existingChatRoom) {
      return res.json({ chatRoom: existingChatRoom, msg: "Chat Room already exists." });
    }
    // If no existing room is found, create a new one
    const savedChatRoom = await ChatRoom.create({
      userIds: [fromUserId, toUserId],
      receiver:toUserId
    });
    if (savedChatRoom) {
      return res.json({ chatRoom: savedChatRoom, msg: "Chat Room created successfully." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" }); 
  }
};


const addMessage = async (req, res) => {
  try {
    const { toUserId, fromUserId, message, forwardedPostId  } = req.body;
    let chatRoom = await ChatRoom.findOne({ userIds: { $all: [fromUserId, toUserId] } });
    // If no ChatRoom is found, create a new one
    if (!chatRoom) {
      chatRoom = await ChatRoom.create({
        userIds: [fromUserId, toUserId],
        messages: [],
      });
    } 
    const [fromUser, toUser ] = await Promise.all([
      User.findOne({ _id: fromUserId }, { password: 0 }), 
      User.findOne({ _id: toUserId }, { password: 0 }), 
    ]);

    let forwardedPost = null;
    if (forwardedPostId) {
        forwardedPost = await Post.findById(forwardedPostId);
    }

    // Create the message with the chatRoom set
    const messageData = await ChatMessage.create({
      content: { 
        text: message,
        forwardedPost: forwardedPost,  
      },
      users: [fromUser, toUser],
      sender: fromUserId,
      chatRoom: chatRoom._id,
    });
    if (!messageData) {
      return res.json({ msg: "Failed to add message to the database" });
    }
    // If ChatRoom was newly created, push the message ID to its messages array
    if (!chatRoom.messages.includes(messageData._id)) {
      chatRoom.messages = [messageData._id];
      await chatRoom.save();
    }

    return res.json({ messageData, chatRoom, msg: "Message and Chat Room added successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMessage = async (req, res) => {
  try { 
    
    const {toUserId,fromUserId} = req.body;
    const messages = await ChatMessage.find({
      users: {
        $all: [toUserId,fromUserId],
      },
    })
    .populate('chatRoom') 
    .lean()
    .sort({ updatedAt: 1 });

    const userIdsArray = messages[0]?.chatRoom?.userIds || []; 
    const userData = await User.find({ _id: { $in: userIdsArray } },{ password: 0 }).lean();
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender,
        message: msg.content ? msg.content.text : "",
        postMessage: msg.content ?  msg.content.forwardedPost : "",
        createdAt: msg.createdAt,
        chatRoom: {
          _id: msg.chatRoom._id,
          userIds: userData, 
          messages: msg.chatRoom.messages,
          createdAt: msg.chatRoom.createdAt,
          updatedAt: msg.chatRoom.updatedAt,
        },
      };
    });
    
    res.json(projectedMessages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getUsersForChat,
  addMessage,
  getMessage,
  createRoomID
};