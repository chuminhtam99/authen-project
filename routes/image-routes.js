const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-auth-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");

const {
  uploadImage,
  fetchImgController,
  deleteImage,
} = require("../controllers/image-controller");

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImage
);

router.get("/get", fetchImgController);
router.delete("/:id", authMiddleware,adminMiddleware, deleteImage);

module.exports = router;
