const cloudinary = require("../config/cloudinary");

const User = require("../models/Image");
const { uploadImageToCloudinary } = require("../helpers/cloudinaryHelpers");
const fs = require("fs");
const Image = require("../models/Image");

const fetchImgController = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 2;
  const startNumber = (page - 1) * 2;

  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = 1;
  if (req.query.sortOrder == -1) {
    sortOrder = -1;
  }

  const howToSort = {};
  howToSort[sortBy] = sortOrder;
  console.log(await Image.countDocuments());

  const numberOfPage = Math.ceil((await Image.countDocuments()) / limit);

  const allImgInDB = await Image.find()
    .sort(howToSort)
    .skip(startNumber)
    .limit(limit);
  if (allImgInDB) {
    res.status(200).json({
      success: true,
      currentPage: page,
      numberOfPage: numberOfPage,
      data: allImgInDB,
    });
  } else {
    res.status(400).json({
      success: false,
      msg: "cannot query all img in db",
    });
  }
};

const uploadImage = async (req, res) => {
  try {
    //1. check if file is missing in req
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "cannot find the file",
      });
    }
    // console.log("ok 1");

    // 2. upload to cloudinary:
    const { url, public_id } = await uploadImageToCloudinary(req.file.path);

    // 3. communicate with db:
    const newlyUploadedImage = await Image.create({
      url: url,
      publicId: public_id,
      uploadedBy: req.aaa.userId,
    });

    if (newlyUploadedImage) {
      res.status(201).json({
        success: true,
        message: "created image done in db",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Something went wrong! created image cannot be done in db",
      });
    }
    // 4. delete file in local
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.log(
      "error: Something went wrong! Please try upload img again: ",
      error
    );

    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try upload img again",
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const getCurrentImgId = req.params.id;
    if (!getCurrentImgId) {
      return res.status(400).json({
        success: false,
        message: "cannot find image",
      });
    }
    //find image
    const currentImage = await Image.findById(getCurrentImgId);
    if (!currentImage) {
      return res.status(400).json({
        success: false,
        message: "cannot find image in db",
      });
    }
    //check if the login person is the owner of image
    if (currentImage.uploadedBy.toString() !== req.aaa.userId) {
      return res.status(403).json({
        success: false,
        message: "not the owner of pic",
      });
    }
    console.log(currentImage);

    //delete first in cloudinary
    await cloudinary.uploader.destroy(currentImage.publicId);

    //delete in db:
    await Image.findByIdAndDelete(getCurrentImgId);

    return res.status(200).json({
      success: true,
      message: "delete image ok",
    });
  } catch (error) {
    console.log("Err ->", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong with delete image",
    });
  }
};

module.exports = { uploadImage, fetchImgController, deleteImage };
