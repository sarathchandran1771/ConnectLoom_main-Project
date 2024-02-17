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

postRouter.post("/report-Comment",blockUserMiddleware, commentController.reportOnComment);

postRouter.post("/delete-Comment",blockUserMiddleware, commentController.deleteComment);

//archive post 

postRouter.get("/getArchivePost/:userId",blockUserMiddleware, postController.getArchivePostOnprofile);

postRouter.patch("/archivePost/:postId", postController.archivePost);

//save post

postRouter.post("/savePost", postSaveController.savePost);

postRouter.get("/getSavedPost", postSaveController. getAllSavedPosts);


postRouter.get("/getLikesOnPost", PostLikeController. getAllLikedPost);

//Like post

postRouter.post("/postLike", PostLikeController.likeUnlikePost);


module.exports = postRouter;



