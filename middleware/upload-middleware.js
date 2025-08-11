const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({ // do file đc gửi dưới dạng multipart/form-data nên ta sẽ dùng 1 lib tên multer để extract the file's content and metadata 
  destination: function (req, file, cb) { // nơi download file về local
    cb(null, "uploads/");
  },
  // filename is used to determine what the file should be named inside the folder.
  filename: function (req, file, cb) {
    console.log("req: ", req); // req ở đây là request của user
    console.log("file: ", file); // file đã đc parse và trông ntn:



    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)//cách đặt tên file
    );
  },
});

//file filter function
const checkFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images"));
  }
};

//multer middleware
module.exports = multer({
  //nhìn chung đây là 1 instance của multer có nhiều props
  storage: storage,
  fileFilter: checkFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB file size limit
  },
});
