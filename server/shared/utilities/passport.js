const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../../src/models/userSchema")

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.FRONTEND_BASEURL + '/google/callback',
    },
      async (accessToken, refreshToken, profile, done) => {
        console.log("profile from google", profile)
        const newUser = {
          emailId: profile.id,
          username: profile.displayName,
          firstName: profile.name.givenName,
          profilePic:profile.photos[0].value,
        }

        try {
          let user = await User.findOne({ emailId: profile.id });
          console.log("User from MongoDB:", user);
  
          if (user) {
            console.log("User found. Authenticating...");
            done(null, user);
          } else {
            console.log("User not found. Creating a new user...");
            user = await User.create(newUser);
            console.log("New user created:", user);
            done(null, user);
          }
        } catch (err) {
          console.error("Error during user creation/fetching:", err);
          done(err);
        }
      }
    )
  );
  

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}