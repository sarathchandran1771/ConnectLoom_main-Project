//Middleware /blockUserMiddleware 
const User = require("../models/userSchema");
const Post = require("../models/postSchema");
const { logoutUser } = require("../controllers/user/userContorller");

const blockUserMiddleware = async (req, res, next) => {
  try {
    const userId = req.body.userId || req.params.userId || req.query.userId; 
    const fromUserId = req.query.fromUserId; 
    const postId = req.body.postId || req.params.postId || req.query.postId;  

    const user = await User.findById(userId);
    const users = await User.findById(fromUserId);
    const userpost = await Post.findById(postId);     

    // Check if userpost is null before trying to access its properties
    if (!userpost) {
      console.log("Post not found"); 
      return res.status(404).json({ error: "Post not found" });
    }

    const userData = userpost.user ? await User.findById(userpost.user._id) : null;

    if (!userData) {
      console.log("User not found"); 
      return res.status(404).json({ error: "User not found" });
    }

    if ((userData && userData.isVerified === false) || (user && user.isVerified === false) || (users && users.isVerified === false)){
      logoutUser(req, res);
      return;
    }
  } catch (error) {
    console.error("Error checking user status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  next();
};


  module.exports = blockUserMiddleware;
