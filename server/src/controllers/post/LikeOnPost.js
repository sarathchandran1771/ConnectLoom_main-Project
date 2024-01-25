const Post = require("../../models/postSchema");
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
        return res.status(404).json({ success: false, message: "Post not found" });
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
  


module.exports = { likeUnlikePost };
