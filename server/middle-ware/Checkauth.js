const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    // console.log(req);
    const token = req.cookies.accessToken || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    
    if (!token) {
      return res.status(401).json({ message: "No access token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    req.userData = {
      userId: decodedToken.userId,
      userEmail: decodedToken.userEmail,
      userRole: decodedToken.userRole,
    };

    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Auth failed!", ErrorMessage: error.message });
  }
};
