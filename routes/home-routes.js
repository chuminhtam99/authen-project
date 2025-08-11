const express = require("express");
const router = express.Router();
// const {
//   registerUser,
// } = require("../controllers/auth-controller.js");

const authMiddleware = require("../middleware/auth-middleware");

router.get("/welcome", authMiddleware, (req, res) => {
  res.json({
    message: "welcome home",
    data: req.aaa,
  });
});

module.exports = router;
