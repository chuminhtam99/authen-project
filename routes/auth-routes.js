const express = require("express");
const router = express.Router();
const {registerUser, loginUser, getAllUser, changePassword} = require("../controllers/auth-controller.js");
const authMiddleware = require("../middleware/auth-middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get", getAllUser);
router.post("/change-password", authMiddleware, changePassword);


module.exports = router;
