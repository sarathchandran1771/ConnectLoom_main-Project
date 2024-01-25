//routes/post/postRoutes.js
const express = require("express");
const postRouter = express.Router();

const postController = require("../../controllers/post/postController");
const commentController = require("../../controllers/post/commentController")
const postSaveController = require("../../controllers/post/savedController")
const PostLikeController = require("../../controllers/post/LikeOnPost")
const blockUserMiddleware = require("../../middleware/blockUserMiddleware ");


const verifyToken = require("../../../shared/utilities/authToken");
const cloudinaryMiddleware = require("../../middleware/cloudinaryMiddleware")

postRouter.post("/post", postController.postNewDataPosting);

postRouter.get("/all-posts", postController.getAllPosts); 

postRouter.delete('/deletePosts/:postId',blockUserMiddleware, postController.deletePost);

postRouter.patch("/reportPost",blockUserMiddleware, postController.reportPost);


//comment section
postRouter.post("/post-Comment",blockUserMiddleware, commentController.commentOnPost);

postRouter.get("/get-Comment",commentController.getCommentsOnPost);

postRouter.post("/replay-Comment",blockUserMiddleware, commentController.replayForComment);

//archive post 

postRouter.get("/getArchivePost/:userID",blockUserMiddleware, postController.getDataPostedOnprofile);

postRouter.patch("/archivePost/:postId",blockUserMiddleware, postController.archivePost);

//save post

postRouter.post("/savePost", postSaveController.savePost);

postRouter.get("/getSavedPost", postSaveController. getAllSavedPosts);


//Like post

postRouter.post("/postLike", PostLikeController.likeUnlikePost);


module.exports = postRouter;



