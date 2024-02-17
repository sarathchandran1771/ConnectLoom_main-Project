const Post = require("../../models/postSchema");
const User = require("../../models/userSchema");
const Likes = require("../../models/likesSchema")


const likeUnlikePost = async (req, res) => {
    try {
      const { postId } = req.query;
      const { userId } = req.body;
  
      const post = await Post.findById({
        _id: postId,
        isReport: false,
        archived: false,
    });

     if (!post) {
        return res.status(404).json({ success: false, message: "Liked Post not found" });
      }

      const likes = await Likes.findOne({ user: userId, post: postId }); 
  
      if (!likes) {
         await Likes.create({ user: userId, post: postId, likes: new Map([[userId, true]]) });
        console.log("Liked post");
        post.likes.push({ user: userId, isLiked: true });
        await post.save();
      } else {
        await Likes.findOneAndDelete({ user: userId, post: postId });
        post.likes = post.likes.filter(like => !like.user.equals(userId));
        await post.save();
        console.log("Unliked post");
      }
  
      res.status(200).json({ success: true, message: "Like/Unlike successful",updatedPostData: post, });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  

// const likeUnlikePost = async (req, res) => {
//   try {
//     const { postId } = req.query;
//     const { userId } = req.body;

//     const post = await Post.findById({
//       _id: postId,
//       isReport: false,
//       archived: false,
//     }).populate('user').select('-password');

//     if (!post) {
//       return res.status(404).json({ success: false, message: "Liked Post not found" });
//     }

//     const likes = await Likes.findOne({ user: userId, post: postId });

//     if (!likes) {
//       await Likes.create({ user: userId, post: postId, likes: new Map([[userId, true]]) });
//       console.log("Liked post");
//       // Update the user's isLiked array with the new postId
//       const user = await User.findById(userId);
//       user.isLiked.push(postId);
//       await user.save();

//     } else {
//       await Likes.findOneAndDelete({ user: userId, post: postId });
//       // Remove the postId from the user's isLiked array
//       const user = await User.findById(userId);
//       user.isLiked = user.isLiked.filter(likedPostId => likedPostId.toString() !== postId);
//       await user.save();
//       console.log("Unliked post");
//     }

//     res.status(200).json({ post,likes });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

  const getAllLikedPost = async (req, res) => {
    try {
      const { userId } = req.query;
      const LikedPosts = await Likes.find({ user: userId }).populate('user').select('-password')
  
  console.log("LikedPosts",LikedPosts)
     res.status(200).json(LikedPosts);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };
  

module.exports = { 
  likeUnlikePost,
  getAllLikedPost
 };
