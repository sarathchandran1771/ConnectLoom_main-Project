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
dotenv.config();

// Connect to MongoDB
connectDB();

const userRouter = require("./src/routes/user/userRoute");
const postRouter = require("./src/routes/post/postRoute");
const adminRouter = require("./src/routes/adminRoutes/adminRoutes");

const passportSetup = require('./shared/utilities/passport')

app.use(corsManage);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.listen(port, () => {
    console.log("Server started listening on port", port);
});