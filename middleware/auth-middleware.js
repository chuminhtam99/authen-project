var jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // to get the jwt token created in auth-controller

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "access denied. no token provided. please login to continue",
    });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.aaa = decodedToken; // can name a contribute of req to whatever you want
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "invalid signature",
    });
  }
  next();
};

module.exports = authMiddleware;
