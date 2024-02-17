const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userSchema');
const adminControllers = require('../controllers/admin/adminControllers');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    // Extract the token part (after "Bearer ")
    token = authorizationHeader.split(' ')[1];
  }


  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('decoded', decoded);
      // Assuming you want to use the decoded data or attach it to the request object
      req.user = decoded;

    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    // Token not available, call logout
    adminControllers.AdminLogout(req, res);
    return; // Ensure that you exit the middleware after calling logout
  }

  next();
});

module.exports = protect;
