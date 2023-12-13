// middleware/passwordStrengthMiddleware.js
const zxcvbn = require('zxcvbn');

const validatePasswordStrength = (password) => {
  const passwordStrength = zxcvbn(password);
  if (passwordStrength.score < 3) {
    return {
      error: "Weak password. Please choose a stronger password.",
      suggestions: passwordStrength.feedback.suggestions,
    };
  }
  return null;
};

const passwordStrengthMiddleware = (req, res, next) => {
  const passwordStrengthError = validatePasswordStrength(req.body.password);
  if (passwordStrengthError) {
    return res.status(400).json(passwordStrengthError);
  }
  next();
};

module.exports = passwordStrengthMiddleware;
