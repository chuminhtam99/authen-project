const express = require("express");
const router = express.Router();
// const {
//   registerUser,
// } = require("../controllers/auth-controller.js");

const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-auth-middleware");

router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {

  res.status(200).json({
    message: "welcome admin to admin page, your username is:",
    data: req.aaa.username,
  });
});

module.exports = router;
