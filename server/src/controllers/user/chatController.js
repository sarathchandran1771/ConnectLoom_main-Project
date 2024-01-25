//controllers/chatControllers
const ChatMessage = require('../../models/chatSchema');
const ChatRoom = require('../../models/chatRoomSchema');
const User = require("../../models/userSchema");


const getUsersForChat = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({ _id: { $ne: userId },isVerified: true });
    if (users.length === 0) {
      return res.status(401).json({ message: 'User Not found' });
    }
    console.log("req.body", req.body)
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
    const { toUserId, fromUserId, message } = req.body;
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
    // Create the message with the chatRoom set
    const messageData = await ChatMessage.create({
      content: { text: message },
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
    console.log("req.messages",messages)
    console.log("req.userData",userData)

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender,
        message: msg.content ? msg.content.text : "",
        createdAt: msg.createdAt,
        chatRoom: {
          _id: msg.chatRoom._id,
          userIds: userData, 
          messages: msg.chatRoom.messages,
          createdAt: msg.chatRoom.createdAt,
          updatedAt: msg.chatRoom.updatedAt,
        },      };
    });
    console.log("projectedMessages",projectedMessages)
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





// <!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <link rel="icon" href="./assets/profile_pic.jpg" />

//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>ConnectLoom</title>
//     <script type="module" crossorigin src="/assets/index-6b79f797.js"></script>
//     <link rel="stylesheet" href="/assets/index-72ecd885.css">
//   </head>
//   <body>
//     <div id="root"></div>
    
//   </body>
// </html>