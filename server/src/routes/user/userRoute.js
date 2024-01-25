// routes/user/userRoutes.js
const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

const protect = require("../../middleware/authMiddleware");
const {emailVerificationMiddleware,} = require("../../middleware/EmailIdVerification");
const passwordStrengthMiddleware = require("../../middleware/passwordStrengthMiddleware");
const blockUserMiddleware = require("../../middleware/blockUserMiddleware ");
const S3Middleware = require('../../middleware/S3-UploadMiddleware')

const userController = require("../../controllers/user/userContorller");
const friendRequestController = require("../../controllers/user/followerControllers");
const notificationController = require('../../controllers/user/notificationController');
const ChatController = require('../../controllers/user/chatController');
const AuthController = require('../../controllers/user/authController');


//workspace
// userRouter.post("/google/authenticate",passport.authenticate("google", { scope: ["profile", "email"] }));


userRouter.post(
  "/google/authenticate",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    console.log("Google authentication callback reached.");
    res.redirect("/login");
  }
);

userRouter.get(
  "/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    console.log("logged-G-callback"); 
    res.redirect("/home");
  }
);

userRouter.post( 
  "/new/user",
  passwordStrengthMiddleware,
  userController.postNewUserRegister
  );

userRouter.post("/mail-verification", userController.OAuth);

userRouter.post("/verifyemail", userController.verifyEmail);

userRouter.post("/login", passwordStrengthMiddleware, userController.getNewRegisteredUser); 

userRouter.post("/forgetPassword", userController.userForgetPassword);

userRouter.post("/resetPassword/:id/:token", userController.resetPassword);

userRouter.patch("/reportUser",blockUserMiddleware, userController.reportUser); 

userRouter.patch("/edit-profile",blockUserMiddleware, userController.updateUser);


userRouter.post("/upload-profileImage",S3Middleware.upload.single('file'), userController.uploadProfileImage);

userRouter.post("/logout", userController.logoutUser);

userRouter.post("/check-and-logout", userController.checkAndLogout);


// POST endpoint to send a friend request
userRouter.post('/send-request',blockUserMiddleware, friendRequestController.sendRequest);


userRouter.get('/pending-request',blockUserMiddleware, friendRequestController.getPendingRequest);

// POST endpoint to accept or decline a friend request
userRouter.post('/respond-request', friendRequestController.respondRequest);

//confirm-payment
userRouter.post('/paypal/payment', userController.paypalPayment);

userRouter.get('/paypal/success', userController.paypalSuccess);

userRouter.post("/Confirm-payment", userController.ConfirmPayment);

userRouter.post('/webhook', userController.webhookHandler);

userRouter.get('/search-users',userController. searchUsers);


// Route to create a notification
userRouter.post('/notifications', notificationController.createNotification);

// Route to get unread notifications for a user
userRouter.get('/notifications/unread/:userId', notificationController.getUnreadNotifications);

// Route to mark a notification as read
userRouter.patch('/notifications/:notificationId/mark-read', notificationController.markNotificationAsRead);

//route for chat
userRouter.get('/getChatUsers/:userId', ChatController.getUsersForChat);

userRouter.post('/addMessage', ChatController.addMessage);

userRouter.post('/getMessage', ChatController.getMessage);

userRouter.post('/createRoom', ChatController.createRoomID);

//faceBook login

userRouter.post('/facebooklogin', AuthController.faceBookLogin);




module.exports = userRouter;
