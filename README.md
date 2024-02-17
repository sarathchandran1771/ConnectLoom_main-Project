# ConnectLoom_main-Project

# ConnectLoom - Social Media Application (MERN Stack)

## Project Overview
ConnectLoom is a social media application built using the MERN (MongoDB, Express.js, React, Node.js) stack. It provides users with a platform to connect, share posts, and engage with friends. This README file serves as a guide for developers and administrators to understand the project structure, deployment process, and technologies used.

## Features

### User Side Features

**User UI :**

A clean and intuitive user interface built with React and Material UI.

-User Registration
Allows users to register using a valid email address.

-Login
Users can securely login using their registered credentials.

-JWT Token Authentication
Implements JSON Web Token (JWT) authentication for secure user sessions.

-Mail Verification
Sends a verification email upon registration to ensure the authenticity of user accounts.

-Add Posts
Enables users to create and share posts with text and images.

-Delete Post
Allows users to delete their own posts.

-Profile
Displays user profiles with relevant information.

-Forget & Reset Password
Provides functionality for users to reset their passwords in case of forgetfulness.

-Report Post/User
Users can report posts or other users with specific reasons for moderation.

-Profile Image (S3 Bucket)
Stores user profile images securely in an S3 bucket.

-Private/Public Account
Users can choose to make their accounts private or public.

-Send Friend Request
Initiates friend requests between users.

-Accept Friend Request
Allows users to accept friend requests.

-Verified Account (Block Ads)
Verified accounts enjoy an ad-free experience.

-Search Friend
Users can search for friends on the platform.

-Saved Posts
Users can bookmark and view saved posts.

-Archive Post
Option to archive posts for future reference.

-Explore
Discover trending posts and users.

-Chat
Real-time messaging between friends with Socket io.

-Notifications
Users receive notifications for friend requests, messages, etc.

-Report on Comments
Allows reporting of comments with specific reasons.

-Delete Comments
Users can delete their comments.

-Forward Posts
Share posts with other users.

### Admin Side:

-Admin UI
Admin panel for managing users and posts.

-Admin Login
Secure login for administrators.

-User Management
Admins can manage user accounts.

-Post Management
Admins can moderate and manage posts.

-JWT Token Authentication
Implements JWT authentication for admin sessions.

-Push Ads
Ability to push advertisements to the platform.

-Dashboard
Provides an overview of user and post statistics.


## Technologies Used

**Frontend**

-React
-Redux
-RTKQ (Redux Toolkit Query)
-Material UI

**Backend**

-Node.js
-Express.js

**Database**

-MongoDB

**External Services**

-Socket io (real-time chat)
-Nodemailer (Email services)
-Email validator (Email verification)
-Bcrypt (Password hashing)
-Facebook OAuth
-Google OAuth
-Cloudinary (Image storage)
-S3 Bucket (Profile images)

**Deployment**

-NGINX (Web server)
-AWS (Cloud services)
-EC2 instances

## Installation

1. Clone the repository:
   
```bash
git clone https://github.com/sarathchandran1771/ConnectLoom_main-Project.git
cd ConnectLoom

