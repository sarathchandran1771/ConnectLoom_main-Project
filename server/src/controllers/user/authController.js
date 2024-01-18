const express = require('express');
const User = require("../../models/userSchema");
const Post = require("../../models/postSchema.js")
const fetch = require('node-fetch');
const verifyToken = require("../../../shared/utilities/authToken");

const faceBookLogin = async (req, res) => {
    try {
      console.log(req.body);
      const { userID, accessToken } = req.body;
  
      let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
  
      fetch(urlGraphFacebook, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then(async (graphApiResponse) => { // Rename the variable to avoid conflict
          const { email, name } = graphApiResponse;
          try {
            const user = await User.findOne({ emailId: email }).exec();
            if (user) {
              const token = verifyToken(res, user._id);
              const postsByUser = await Post.find({ user: user._id, isReport: false });
              console.log("User logged in",user);

              res.json({
                _id: user._id,
                username: user.name,
                emailId: user.emailId,
                profilename: user.profilename,
                Bio: user.Bio,
                privatePublic: user.privatePublic,
                profilePic: user.profilePic,
                token: token,
                postsByUser: postsByUser,
                isPremium: user.isPremium,
                paymentStatus: user.paymentStatus,
                isVerified: user.isVerified,
              });
  
              console.log("User logged in");
            }
          } catch (err) {
            return res.status(400).json({ error: 'Something went wrong!' });
          }
        });
    } catch (error) {
      // Handle top-level errors here if needed
    }
  };
  

module.exports = {
    faceBookLogin
};
