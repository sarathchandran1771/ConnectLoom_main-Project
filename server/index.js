//backend // server/index.js

const express = require("express");
const corsManage  = require("./shared/utilities/corsManage");
const { connectDB } = require("./shared/config/db");
const { notFound, errorHandler } = require ('./src/middleware/errorMiddleware');
const cookieParser = require ('cookie-parser');
const passport = require("passport")
const cookieSession = require("cookie-session")
const dotenv = require("dotenv");
const app = express();  
const port = 5000;
const path = require('path')
const SECRET_KEY = process.env.STRIPE_SECRET_KEY
const stripe = require("stripe")(SECRET_KEY)
dotenv.config();

// Connect to MongoDB
connectDB();

const userRouter = require("./src/routes/user/userRoute");
const postRouter = require("./src/routes/post/postRoute");
const adminRouter = require("./src/routes/adminRoutes/adminRoutes");
const passportSetup = require('./shared/utilities/passport')


const rawMiddleware = (req, res, next) => {
  if (req.path === '/webhook') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    next();
  }
};
app.use(corsManage);
app.use(express.urlencoded({ extended: true }));
// Use the custom middleware
app.use(rawMiddleware);app.use(express.json());
app.use(cookieParser());
app.use(
  cookieSession({ 
    name: "session", 
    keys: ["connectLoom"],
    maxAge: 24 * 60 * 60 * 100,
  }) 
);

app.use(passport.initialize());
app.use(passport.session()); 
app.use('/public', express.static(path.join(__dirname, 'public')));
 
app.use("/", userRouter);
app.use("/post", postRouter);
app.use("/admin", adminRouter);

// Move the catch-all middleware to the end
app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () =>console.log("Server started listening on port", port));

const io = require("socket.io")(server,{
  pingTimeout: 6000,
  cors: {
    origin: "http://localhost:3000",
  },
}); 

io.on("connection",(socket)=>{
  socket.on('setup',(userData)=>{
    socket.join(userData.id);
    socket.emit("connected")
  })
  
  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log("room",room)
    socket.emit("connected");
  })

  socket.on('new message', (newMessageRecieved) => {
  var chat = newMessageRecieved.chatRoom
    // Check if 'content' property exists in 'newMessageRecieved'
    if (!chat.userIds)return console.log("chat users not defined") 
      //'sender' property is the user ID
      const senderUserId = newMessageRecieved.messageData.sender;      
    // Emit the message to all users in the room except the sender
    chat.userIds.forEach((user) => {
      if (user._id === senderUserId) return;
      // Emit the message to the user
      socket.in(user._id).emit("message received",newMessageRecieved);
    });
  });
});
