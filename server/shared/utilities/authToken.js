const jwt = require('jsonwebtoken');

const verifyToken = (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return token;
  } catch (error) {
    console.error('Error generating and saving JWT:', error);
    throw error;
  }
};


module.exports = verifyToken; 
