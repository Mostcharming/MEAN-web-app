const jwt = require("jsonwebtoken");

// verifying if the jwt(token) hasnt expired or the user is issued a jwt
module.exports = (req, res, next) => {
  try {
    // the actual token is the 2nd in the array
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
