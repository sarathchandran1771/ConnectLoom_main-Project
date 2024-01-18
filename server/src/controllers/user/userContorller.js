// controllers/user/userControllers.js
const express = require("express");
const cookieParser = require("cookie-parser");
const validator = require("validator");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const corsManage = require("../../../shared/utilities/corsManage");
const saltRounds = 10;
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const verifyToken = require("../../../shared/utilities/authToken");
const SECRET_KEY = process.env.STRIPE_SECRET_KEY
const stripe = require("stripe")(SECRET_KEY)
const paypal = require('paypal-rest-sdk');

const {
  sendVerificationEmail,
} = require("../../middleware/EmailIdVerification");
const {
  cloudinaryConfig,
} = require("../../../shared/config/cloudinaryConfig.js");
const { generateSignature } = require("../../middleware/cloudinaryMiddleware");
const { v4: uuidv4 } = require("uuid");
const generateUniqueToken = () => uuidv4();
const verificationToken = generateUniqueToken();
const User = require("../../models/userSchema");
const Post = require("../../models/postSchema.js")
cloudinaryConfig();
dotenv.config();
userRouter.use(corsManage);
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  }
});

const postNewUserRegister = async (req, res) => {
  try {
    const {
      username,
      password,
      emailId,
      profilename,
      privatePublic,
      profilePic,
      Bio,
      isPremium,
    } = req.body;
    if (!validator.isEmail(emailId)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    if (!username || !password || !emailId) {
      return res
        .status(400)
        .json({ error: "Username, password, and email are required fields" });
    }

    let userExists = await User.findOne({ emailId });
    if (userExists) {
      return res.status(400).json({ error: "Email ID already exists" });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const user = new User({
      username,
      password: hash,
      emailId,
      profilename,
      emailToken: verificationToken,
      Bio,
      privatePublic,
      profilePic,
      isPremium
    });

    if (user) {
      await user.save();
      sendVerificationEmail(user);
    } else {
      console.log("Failed to create user");
      return res.status(500).json({ error: "Failed to create user" });
    }
  } catch (error) {
    console.error("Internal error 500", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const emailToken = req.body.emailToken;

    if (!emailToken) return res.status(404).json("EmailToken not found..");

    const user = await User.findOne({ emailToken });

    if (user) {
      user.emailToken = null;
      user.isVerified = true;

      await user.save();

      const token = verifyToken(res, user._id);

      console.log("Email verified successfully");
      res.status(200).json({
        _id: user._id,
        name: user.username,
        emailId: user.emailId,
        message: "User registered successfully",
        token: token,
        isVerified: user?.isVerified,
      });
    } else {
      console.error("User not found for verification");
      res.status(404).json("User not found for verification");
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json(error.message);
  }
};

const getNewRegisteredUser = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    const postsByUser = await Post.find({ user: user._id, isReport: false });
 
    const isPasswordMatch = await user.matchPassword(password);

    user.reportCount += 1;

    if (user.reportCount >= 5) {
      user.isVerified = false;
    }

    if (user && isPasswordMatch && user.isVerified == true) {
      const token = verifyToken(res, user._id);
      res.json({
        _id: user._id,
        username: user.username,
        emailId: user.emailId,
        profilename:user.profilename,
        Bio: user.Bio,
        privatePublic:user.privatePublic,
        profilePic:user.profilePic,
        token:token,
        postsByUser:postsByUser,
        isPremium:user.isPremium,
        paymentStatus:user.paymentStatus,
        isVerified:user.isVerified
      });
      console.log("User logged in");
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Internal error 500", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userForgetPassword = async (req, res) => {
  try {
    const { emailId } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.send({ status: "User not exists" });
    }
    const token = verifyToken(res, user._id);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const logoSrc = `${process.env.FRONTEND_BASEURL}/views/icons/ConnectLoom_Logo.png`;
    console.log("logoSrc",logoSrc)
    const mailOptions = {
      from: process.env.USER,
      to: emailId,
      subject: 'Reset Your ConnectLoom Password',
      html: `
        <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; text-align: center; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
          <img src="${logoSrc}" alt="ConnectLoom Logo" style="max-width: 100px; margin-bottom: 20px;">
          <h2 style="color: #333;">Forgot Your Password?</h2>
          <p style="color: #555;">We received a request to reset your password. If you didn't make this request, you can ignore this email.</p>
          <p style="color: #555;">To reset your password, click on the link below:</p>
          <a href="${process.env.FRONTEND_BASEURL}/resetPassword/123/token"
             style="display: inline-block; background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Reset Password
          </a>
          <p style="color: #555; margin-top: 20px;">If the button above doesn't work, you can also click the link below:</p>
          <p style="color: #007BFF;">
            <a href="${process.env.FRONTEND_BASEURL}/resetPassword/123/token" style="color: #007BFF; text-decoration: none;">
              ${process.env.FRONTEND_BASEURL}/resetPassword/123/token
            </a>
          </p>
          <p style="color: #555;">Thank you for choosing ConnectLoom!</p>
        </div>
      `,
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error from forget password", error);
        return res.status(500).send({ status: "Internal Server Error" });
      } else {
        console.log("Email sent: " + info.response);
        return res.send({ status: "Success" });
      }
    });
    

    res.send({ status: "Token sent successfully" });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    res.status(500).send({ status: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { confirmPassword } = req.body;
  try {
    // Check if the user exists
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Verify the token
    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);
    if (isTokenValid) {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(confirmPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: "Password reset successful" });
    } else {
      res.status(401).json({ message: "Token not verified" });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password" });
  } 
};

const uploadProfileImage = async (req, res) => {
  try {
    const { userId } = req.body;
    const imageUrl = `https://${process.env.S3_BUCKETNAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${req.file.key}`;
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for updating");
      return res.status(404).json({ error: "User not found" });
    }
   
    if (user.isVerified === true) {
      user.profilePic = imageUrl;

      const updatedUser = await user.save();
      return res.status(200).json({ message: "Profile updated successfully", updatedUser });
    }
  } catch (error) {
    console.error("Error updating user", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Your Express route handler
const checkAndLogout = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.isVerified) {
      // If blocked, perform logout
      res.cookie("jwt", "", {
        httpOnly: true, 
        expires: new Date(0),
      });
      return res.status(200).json({ message: "User is blocked. Logged out successfully", isVerified: false });
    }
    // If not blocked, you can handle this case differently or respond accordingly
    res.status(200).json({ message: "User is not blocked", isVerified: true });
  } catch (error) {
    console.error('Error checking and logging out user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 


const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  console.log("Logged out successfully");
  res.status(200).json({ message: "Logged out successfully" });
};

const OAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    const clientId = process.env.Client_ID;
    console.log("req.body", req.body);
    console.log("clientId", clientId);
    
    if (idToken) {
      const response = await authClient.verifyIdToken({
        idToken,
        audience: clientId,
      });
      const {
        isVerified: email_verified,
        emailId,
        username,
        profilePic,
      } = response.payload;

      if (email_verified) {
        const user = await User.findOne({ emailId }).exec();

        if (user) {
          return res.json(user);
        } else {
          // Assuming emailId is unique and required in the schema
          let password = emailId + clientId;
          console.log("password", password);

          const salt = bcrypt.genSaltSync(saltRounds);
          const hash = bcrypt.hashSync(password, salt);
          // Hash the password before saving it to the database

          let newUser = new User({
            emailId,
            username,
            profilePic,
            password: hash,
          });
          console.log("newUser", newUser);

          await newUser.save();

          const token = verifyToken(res, newUser._id);

          console.log("Email verified successfully");
          res.status(200).json({
            _id: newUser._id,
            name: newUser.username,
            emailId: newUser.emailId,
            message: "User registered successfully",
            token: token,
            isVerified: newUser?.isVerified,
          });
        }
      } else {
        res.status(400).json({ error: "Email not verified" });
      }
    } else {
      res.status(400).json({ error: "Missing idToken in the request body" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during authentication" });
  }
};

const reportUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      console.log("user not found for reporting");
      return res.status(404).json({ error: "user not found" });
    }

    user.reportCount += 1;

    if (user.reportCount >= 5) {
      user.isVerified = false;
    }

    const updatedUser = await user.save();

    console.log("user reported successfully");
    return res.status(200).json({message: "successfully reported",updatedUser});
  } catch (error) {
    console.error("Error reporting user", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { 
      userId,
      username,
      profilename,
      password,
      privatePublic,
      profilePic,
      Bio,
     } = req.body;
    
    const user = await User.findById({_id: userId});

    console.log("user for edit", user);

    if (!user) {
      console.log("User not found for updating");
      return res.status(404).json({ error: "User not found" });
    }
   
    if (user.isVerified === true) {
      // Hash the password
      if (password) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        console.log("hashedPassword",hashedPassword)
        user.password = hashedPassword;
      }
      // Update user fields
      user.username = username;
      user.profilename = profilename;
      user.privatePublic = privatePublic;
      user.profilePic = profilePic;
      user.Bio = Bio;

      // Ensure followingCount is not less than 0
      if (user.account.followingCount < 0) {
        user.account.followingCount = 0;
        }
      // Ensure followingCount is not less than 0
      if (user.account.followersCount < 0) {
        user.account.followersCount = 0;
      }
      // Save the updated user
      const updatedUser = await user.save();
      console.log("User updated successfully",updatedUser);
      return res.status(200).json({ message: "Profile updated successfully", updatedUser });
    }
  } catch (error) {
    console.error("Error updating user", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const client_secret = process.env.STRIPE_PUBLISHABLE_KEY

const ConfirmPayment = async (req, res) => {
  try {
    const { userId} = req.body;
    console.log("ConfirmPayment req.body", userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for updating");
      return res.status(404).json({ error: "User not found" });
    }
    const totalAmount = 50000;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.emailId,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US'], 
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Subscription',
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_BASEURL}/success`,
      cancel_url: `${process.env.FRONTEND_BASEURL}/cancel`,
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const webhookHandler = async (request, response) => {
  console.log('Welcome  webhookHandler ',);

  const endpointSecret = process.env.STRIPE_ENDPOINT_KEY;

  let event = request.body;
  if (endpointSecret) {
    const signature = request.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }
  let subscription;
  let status;
  switch (event.type) {
    case "customer.subscription.created":
      subscription = event.data.object;
      status = subscription.status;
      break;
    default:
  } 
  if (event.type === "checkout.session.completed") {
    const userMailId = event.data.object.customer_email;
    const updatedUser = await User.findOneAndUpdate(
      { emailId: userMailId },
      { $set: { paymentStatus: true, isPremium: true } },
      { new: true }
    );
    console.log('the payment done and updated', updatedUser);

    const successMessage = "Payment successfully completed.";
    response.json({ updatedUser, successMessage });
  }else{
    response.sendStatus(200);
  }
};


paypal.configure({
  'mode': 'sandbox', // Change to 'live' for production
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret':  process.env.PAYPAL_SECRET_KEY
});


const searchUsers = async (req, res) => {
  try {
    const { searchQuery } = req.query;
    const users = await User.find({isVerified:true,
      $or: [
        { username: { $regex: `^${searchQuery}`, $options: 'i' } },
        { username: { $regex: `^${searchQuery}`, $options: 'i' } },
      ],
    });
    console.log("users",users);
    if (users.length > 0) {
      res.json(users);
    } else {
      res.json({ message: "No results found" });
    }
  } catch (error) {
    console.error("Internal error 500", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const paypalPayment = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("ConfirmPayment req.body", userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for updating");
      return res.status(404).json({ error: "User not found" });
    }

    // Create a payment object
    const payment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: 'YOUR_RETURN_URL',
        cancel_url: 'YOUR_CANCEL_URL'
      },
      transactions: [{
        item_list: {
          items: [{
            name: 'Subscription',
            sku: 'SUBSCRIPTION_SKU',
            price: '150.00', // Fixed charge for subscription
            currency: 'USD',
            quantity: 1
          }]
        },
        amount: {
          currency: 'USD',
          total: '150.00' // Fixed charge for subscription
        },
        description: 'Subscription purchase'
      }]
    };
    paypal.payment.create(payment, function (error, payment) {
      if (error) {
        console.error("Error creating PayPal payment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        // Redirect the user to PayPal for payment approval
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            return res.redirect(payment.links[i].href);
          }
        }
      }
    });

  } catch (error) {
    console.error("Error confirming payment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const paypalSuccess = async (req, res) => {
  const paymentId = req.query.paymentId;
  const payerId = req.query.PayerID;

  // Create an object to execute the payment
  const execute_payment_json = {
    payer_id: payerId
  };

  // Execute the PayPal payment with the provided payment ID and payer ID
  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      // Handle errors if the payment execution fails
      console.error("Error executing PayPal payment:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      // Payment executed successfully, update your database or perform other actions
      // You may want to save relevant information from the payment object to your database
      return res.status(200).json({ success: true, payment });
    }
  });
};




module.exports = {
  verifyEmail,
  postNewUserRegister,
  getNewRegisteredUser,
  logoutUser,
  userForgetPassword,
  resetPassword,
  OAuth,
  reportUser,
  updateUser,
  uploadProfileImage,
  ConfirmPayment,
  paypalPayment,
  paypalSuccess,
  webhookHandler,
  checkAndLogout,
  searchUsers
};
