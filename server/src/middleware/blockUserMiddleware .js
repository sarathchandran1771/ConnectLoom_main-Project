//Middleware /blockUserMiddleware 
const User = require("../models/userSchema");
const Post = require("../models/postSchema");
const mongoose = require('mongoose');
 
const { logoutUser } = require("../controllers/user/userContorller");

const blockUserMiddleware = async (req, res, next) => {
  try {
    // const userId = req.body.userId || req.params.userId || req.query.userId; 
    // const fromUserId = req.query.fromUserId; 
    // const postId = req.body.postId || req.params.postId || req.query.postId;  

    // const user = await User.findById(userId);
    // const users = await User.findById(fromUserId);
    // const userDataOnPost = await Post.find({user:userId});
    // const userpost = await Post.findById(postId);

    // console.log("users",users)

    // const userIds = userDataOnPost.map(entry => mongoose.Types.ObjectId(entry.user));
    // const idOfUser = await User.find({ _id: { $in: userIds } });

    // // const idToBeChecked = userDataOnPost
    // const idToBeCheckedFromPost = userpost
    // console.log("userIds",userIds); 
    // console.log("idOfUser",idOfUser); 
    // //console.log("idToBeCheckedFromPost",idToBeCheckedFromPost); 

    // // Check if userpost is null before trying to access its properties
    // let userData

    // if (userDataOnPost) {
    //   userData = userDataOnPost.user ? await User.findById(userDataOnPost.user._id) : null;
    //   console.log("from userData userData",userData); 
    // }else{
    //   console.log("from userDataOnPost Post not found"); 
    //   return res.status(404).json({ error: "from blocked user Post not found" });
    // }

    // if (userpost) {
    //   userData = userpost.user ? await User.findById({_id:userpost.user._id}) : null; 
    //   console.log("from blockUserMiddleware userpost",userData); 
    // }else{
    //   console.log("from blockUserMiddleware userData not found"); 
    //   return res.status(404).json({ error: "from blockUserMiddleware userData not found" });
    // }


    // if ((userData && userData.isVerified === false) || (user && user.isVerified === false) || (users && users.isVerified === false) ||(userDataOnPost && userDataOnPost.user.isVerified === false)){
    //   logoutUser(req, res);
    //   return;
    // }
  } catch (error) {
    // console.error("Error checking user status:", error);
    // return res.status(500).json({ error: "Internal Server Error" });
  }
  next();
};


  module.exports = blockUserMiddleware;
