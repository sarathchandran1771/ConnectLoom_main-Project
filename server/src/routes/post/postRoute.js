//routes/post/postRoutes.js
const express = require("express");
const postRouter = express.Router();

const postController = require("../../controllers/post/postController");
const commentController = require("../../controllers/post/commentController")
const verifyToken = require("../../../shared/utilities/authToken");
const cloudinaryMiddleware = require("../../middleware/cloudinaryMiddleware")

postRouter.post("/post", postController.postNewDataPosting);

postRouter.get("/all-posts", postController.getAllPosts);

postRouter.get("/dataPosted", postController.getDataPostedOnprofile);

postRouter.delete('/deletePosts/:postId', postController.deletePost);

postRouter.patch("/reportPost", postController.reportPost);


//comment section
postRouter.post("/post-Comment", commentController.commentOnPost);

postRouter.post("/replay-Comment", commentController.replayForComment);



module.exports = postRouter;



