// routes/user/userRoutes.js
const express = require("express");
const userRouter = express.Router();
const passport = require("passport");

const protect = require("../../middleware/authMiddleware");

const {
  emailVerificationMiddleware,
} = require("../../middleware/EmailIdVerification");
const passwordStrengthMiddleware = require("../../middleware/passwordStrengthMiddleware");

const userController = require("../../controllers/user/userContorller");

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

userRouter.post("/mail-verification", userController.OAuth);

userRouter.post(
  "/new/user",
  passwordStrengthMiddleware,
  userController.postNewUserRegister
);

userRouter.post("/verifyemail", userController.verifyEmail);

userRouter.post(
  "/login",
  passwordStrengthMiddleware,
  userController.getNewRegisteredUser
);

userRouter.post("/forgetPassword", userController.userForgetPassword);

userRouter.post("/resetPassword/:id/:token", userController.resetPassword);

userRouter.patch("/reportUser", userController.reportUser);

userRouter.patch("/edit-profile", userController.updateUser);


userRouter.post("/uplaod-profileImage", userController.uploadProfileImage);

userRouter.post("/logout", userController.logoutUser);



module.exports = userRouter;
