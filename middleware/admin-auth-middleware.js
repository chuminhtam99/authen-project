var jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  if (req.aaa.role !== "admin") {
    res.status(400).json({
      message: "not an admin!",
    });
  }
  next();
};

module.exports = adminMiddleware;
